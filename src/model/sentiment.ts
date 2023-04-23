import * as tf from "@tensorflow/tfjs";
import React from "react";
import { useAsync } from "react-use";

const PAD_INDEX = 0; // Index of the padding character.
const OOV_INDEX = 2; // Index fo the OOV character.

/**
 * Pad and truncate all sequences to the same length
 *
 * @param {number[][]} sequences The sequences represented as an array of array
 *   of numbers.
 * @param {number} maxLen Maximum length. Sequences longer than `maxLen` will be
 *   truncated. Sequences shorter than `maxLen` will be padded.
 * @param {'pre'|'post'} padding Padding type.
 * @param {'pre'|'post'} truncating Truncation type.
 * @param {number} value Padding value.
 */
export function padSequences(
  sequences: number[][],
  maxLen: number,
  padding = "pre",
  truncating = "pre",
  value = PAD_INDEX
) {
  return sequences.map((seq) => {
    // Perform truncation.
    if (seq.length > maxLen) {
      if (truncating === "pre") {
        seq.splice(0, seq.length - maxLen);
      } else {
        seq.splice(maxLen, seq.length - maxLen);
      }
    }

    // Perform padding.
    if (seq.length < maxLen) {
      const pad = [];
      for (let i = 0; i < maxLen - seq.length; ++i) {
        pad.push(value);
      }
      if (padding === "pre") {
        seq = pad.concat(seq);
      } else {
        seq = seq.concat(pad);
      }
    }

    return seq;
  });
}

/**
 * Model comes from our public resources.
 */
const LOCAL_URLS = {
  model: "/model.json",
  metadata: "/metadata.json",
};

/**
 * Load pretrained model stored at a remote URL.
 *
 * @return An instance of `tf.Model` with model topology and weights loaded.
 */
async function loadHostedPretrainedModel(url: string) {
  try {
    const model = await tf.loadLayersModel(url);
    return model;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Load metadata file stored at a remote URL.
 *
 * @return An object containing metadata as key-value pairs.
 */
async function loadHostedMetadata(url: string) {
  try {
    const metadataJson = await fetch(url);
    const metadata = await metadataJson.json();
    return metadata;
  } catch (err) {
    console.error(err);
  }
}

type WordMap = { [key: string]: number };

class SentimentPredictor {
  private model?: tf.LayersModel;
  private indexFrom = 0;
  private maxLen = 0;
  private wordIndex: WordMap = {};
  private vocabularySize = 0;

  /**
   * Initializes the Sentiment demo model from a copy of the IMDB snetiment
   * model.
   */
  async init(urls: typeof LOCAL_URLS) {
    this.model = await loadHostedPretrainedModel(urls.model);
    const sentimentMetadata = await loadHostedMetadata(urls.metadata);
    this.indexFrom = sentimentMetadata["index_from"];
    this.maxLen = sentimentMetadata["max_len"];
    this.wordIndex = sentimentMetadata["word_index"];
    this.vocabularySize = sentimentMetadata["vocabulary_size"];
    return this;
  }

  predict(text: string) {
    if (this.model) {
      // Convert to lower case and remove all punctuations.
      const inputText = text
        .trim()
        .toLowerCase()
        .replace(/(\.|\,|\!)/g, "")
        .split(" ");
      // Convert the words to a sequence of word indices.
      const sequence = inputText.map((word) => {
        let wordIndex = this.wordIndex[word] + this.indexFrom;
        if (wordIndex > this.vocabularySize) {
          wordIndex = OOV_INDEX;
        }
        return wordIndex;
      });
      // Perform truncation and padding.
      const paddedSequence = padSequences([sequence], this.maxLen);
      const input = tf.tensor2d(paddedSequence, [1, this.maxLen]);

      const beginMs = performance.now();
      const predictOut = this.model.predict(input) as tf.Tensor;
      const score = predictOut.dataSync()[0];
      predictOut.dispose();
      const endMs = performance.now();

      return { score: score, elapsed: endMs - beginMs };
    } else {
      return { score: undefined, elapsed: 0 };
    }
  }
}

/**
 * Hook into the sentiment engine.
 */
export function useSentiment() {
  const state = useAsync(async () => {
    const predictor = new SentimentPredictor();
    await predictor.init(LOCAL_URLS);
    return predictor;
  }, []);

  return {
    loading: state.loading,
    predict: (text: string) => state.value?.predict(text),
  };
}
