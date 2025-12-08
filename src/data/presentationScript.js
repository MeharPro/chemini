export const presentationScript = [
    {
        text: "Hello! I am Chemini, an AI assistant powered by advanced chemical foundation models. Welcome to 'Advances in Chemistry with Artificial Intelligence'.",
        sender: 'bot',
        delay: 1000
    },
    {
        text: "This project explores how AI models are driving modern chemistry, from molecular design to reaction prediction. We are moving from trial-and-error to data-driven discovery.",
        sender: 'bot',
        delay: 3000
    },
    {
        text: "Here's how AI has revolutionized chemistry over the years:",
        sender: 'bot',
        type: 'visual',
        visualType: 'graph',
        delay: 3500
    },
    {
        text: "Let's start with the basics. What is an AI model in chemistry?",
        sender: 'bot',
        delay: 4000
    },
    {
        text: "In chemistry, AI models are computational systems—often Neural Networks or Transformers—trained on vast datasets of chemical structures and properties. They learn to predict outcomes, suggest synthesis routes, and design new molecules.",
        sender: 'bot',
        delay: 5000
    },
    {
        text: "Here's a visualization of a neural network architecture used in chemical AI:",
        sender: 'bot',
        type: 'visual',
        visualType: 'network',
        delay: 4000
    },
    {
        text: "The field has evolved significantly. Early 'AI' in chemistry was rule-based. Today, we use 'Deep Learning', where models learn features directly from data, allowing for generalization to unseen chemical spaces.",
        sender: 'bot',
        delay: 5000
    },
    {
        text: "A key innovation is the 'System Prompt' in Large Language Models (LLMs).",
        sender: 'bot',
        delay: 3000
    },
    {
        text: "For a chemical LLM, the system prompt acts as a set of meta-instructions. It guides the model to adhere to chemical laws (valency, conservation of mass) and safety constraints, ensuring generated reactions are plausible.",
        sender: 'bot',
        delay: 5000
    },
    {
        text: "Now, let's talk about ChemDFM (Chemical Data Foundation Model).",
        sender: 'bot',
        delay: 3000
    },
    {
        text: "ChemDFM is a breakthrough because it's a 'Foundation Model' specifically pre-trained on chemical text and structures (SMILES, SELFIES). Unlike general LLMs like GPT-4, it 'speaks' chemistry natively.",
        sender: 'bot',
        delay: 5000
    },
    {
        text: "Let's visualize a molecular structure that ChemDFM can analyze:",
        sender: 'bot',
        type: 'visual',
        visualType: 'molecule3d',
        delay: 4000
    },
    {
        text: "While models like AlphaFold revolutionized protein structure prediction (folding amino acid sequences into 3D shapes), ChemDFM focuses on chemical synthesis and reasoning.",
        sender: 'bot',
        delay: 5000
    },
    {
        text: "Here is a visualization of a protein structure, the domain where AlphaFold excels:",
        sender: 'bot',
        type: 'visual',
        visualType: 'protein',
        delay: 4000
    },
    {
        text: "One of the most powerful applications is Retrosynthesis.",
        sender: 'bot',
        delay: 3000
    },
    {
        text: "Retrosynthesis is the art of working backwards. We start with a complex target molecule and break it down into simpler, commercially available starting materials.",
        sender: 'bot',
        delay: 5000
    },
    {
        text: "AI enhances this through 'Atom-Level Reasoning'. It maps every atom in the product back to the reactants, ensuring no atoms are lost or magically created—a common issue in early generative models.",
        sender: 'bot',
        delay: 5000
    },
    {
        text: "Here is a reaction pathway planned by AI, showing how reactants transform into products:",
        sender: 'bot',
        type: 'visual',
        visualType: 'reaction',
        delay: 4000
    },
    {
        text: "Finally, LLM-Augmented Synthesis Design Programs combine the reasoning power of LLMs with rigorous search algorithms (like Monte Carlo Tree Search) to automate the entire design process.",
        sender: 'bot',
        delay: 5000
    },
    {
        text: "Feel free to ask me questions like 'What is ChemDFM?', 'Explain retrosynthesis', or 'How does AlphaFold work?'. I'm ready to help!",
        sender: 'bot',
        delay: 4000
    }
];

export const qaDatabase = {
    "chemdfm": "ChemDFM (Chemical Data Foundation Model) is a 13B parameter LLM trained on chemical literature and molecular representations. It outperforms general models in tasks like reaction prediction and property estimation because it understands the syntax of chemistry.",
    "retrosynthesis": "Retrosynthesis is a technique for solving problems in the planning of organic syntheses. This is achieved by transforming a target molecule into simpler precursor structures regardless of any potential reactivity/interaction with reagents. AI accelerates this by exploring millions of potential disconnections in seconds.",
    "alphafold": "AlphaFold is an AI system developed by DeepMind that predicts a protein's 3D structure from its amino acid sequence. It uses a deep neural network to predict the distances between pairs of amino acids and the angles between chemical bonds.",
    "system prompt": "A system prompt is the initial set of instructions given to an LLM. In chemistry, this might include rules like 'You are an expert chemist', 'Always balance equations', and 'Prioritize non-toxic reagents'.",
    "ai model": "An AI model in chemistry is a mathematical representation of chemical knowledge. It can be a Graph Neural Network (GNN) for molecular properties, or a Transformer for sequence-to-sequence tasks like reaction prediction.",
    "llm": "Large Language Models (LLMs) in chemistry treat molecules as a language. By training on strings like SMILES, they learn the grammar of chemical bonds and reactions, allowing them to generate new valid molecules.",
    "default": "That's a great question. While my current module is focused on the topics of ChemDFM and Retrosynthesis, the field of AI in Chemistry is vast. I'd recommend checking the arXiv papers linked in the proposal for more details!"
};
