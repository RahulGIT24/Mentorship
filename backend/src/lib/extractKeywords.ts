import nlp from "compromise/three";

export function extractKeywords(query:string) {
    const doc = nlp(query);
    const nouns = doc.nouns().out('array'); // Extract nouns
    const separatedNouns = nouns.flatMap((noun:string) => noun.split(/\s+/)); // Split phrases into individual words
    return separatedNouns // Join them with a comma
}