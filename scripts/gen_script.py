import re
import sys

# --- CONFIGURATION ---
TRANSCRIPT_FILE = "Advances In Chemistry With AI-transcript.txt"

# Keywords to trigger visuals - Order matters! More specific phrases first.
VISUAL_MAPPINGS = {
    # Original mappings
    "love and hate": "morph_duality",
    "cranking out": "speed_text",
    "revolutionizing": "chem_revolution",
    
    # NEW: Brain and neural specifics
    "like a brain": "brain_neurons",
    "works like": "brain_neurons",
    
    # NEW: Neural network dots
    "neural network": "neural_network_dots",
    "we have graph": "neural_network_dots",
    
    # NEW: Timeline/Evolution
    "evolved": "evolution_timeline",
    "evolution": "evolution_timeline",
    "progression": "evolution_timeline",
    "over time": "evolution_timeline",
    
    # NEW: Flying letters (language)
    "understanding language": "flying_letters",
    "understanding the language": "flying_letters",
    "language model": "flying_letters",
    
    # NEW: System prompts display
    "system prompt": "system_prompts_display",
    "You are a chemist": "system_prompts_display",
    
    # NEW: Chemistry rules
    "conserve mass": "chemistry_rules",
    "carbon forms": "chemistry_rules",
    "valency": "chemistry_rules",
    "four bonds": "chemistry_rules",
    "4 bonds": "chemistry_rules",
    "cannot be created nor destroyed": "chemistry_rules",
    
    # NEW: Synthesis roadmap
    "synthesis routes": "synthesis_roadmap",
    "reaction pathway": "synthesis_roadmap",
    "plans a reaction": "synthesis_roadmap",
    "visualization": "synthesis_roadmap",
    "LLM-Syn": "synthesis_roadmap",
    "synthesis planning": "synthesis_roadmap",
    "plan the route": "synthesis_roadmap",

    
    # NEW: Big numbers display
    "34 billion": "big_numbers_display",
    "3.8 million": "big_numbers_display",
    "1,400 textbooks": "big_numbers_display",
    "trained on": "big_numbers_display",
    
    # NEW: Protein structure (AlphaFold)
    "protein structure": "protein_structure",
    "AlphaFold": "protein_structure",
    "alpha fold": "protein_structure",
    "folding": "protein_structure",
    
    # NEW: Protein interaction
    "interact with": "protein_interaction",
    "complementary": "protein_interaction",
    "ChemDFM complements": "protein_interaction",
    
    # NEW: Retrosynthesis backwards
    "working backwards": "retrosynthesis_backwards",
    "retrosynthesis": "retrosynthesis_backwards",
    "break it down": "retrosynthesis_backwards",
    "backwards": "retrosynthesis_backwards",
    
    # NEW: Collision simulation
    "collision": "collision_simulation",
    "temperature": "collision_simulation",
    "kinetic": "collision_simulation",
    
    # Existing mappings
    "predicting": "molecule_prediction",
    "simple question": "question_big",
    "computer systems": "computer_chip",
    "transformers": "transformer_blocks",
    "practical toolkit": "toolkit_box",
    "toolkit": "toolkit_box",
    "learning from data": "data_ingest",
    "learn from data": "data_ingest",
    "foundation models": "foundation_models",
    "foundation model": "foundation_models",
    "violate": "violation_block",
    "training data": "chem_dfn_books",
    "million scientists": "million_scientists",
    "SMILES": "smiles_code",
    "augmented": "tools_augment",
    
    # LATEST: ChemDFM Molecule Analysis
    "ChemDFM": "chemdfm_molecule",
    "analyze in real time": "chemdfm_molecule",
    "molecular structure": "chemdfm_molecule",
    "understand chemistry": "chemdfm_molecule",
    
    # LATEST: Scale Pyramid Comparison
    "13 billion": "scale_pyramid",
    "1 trillion": "scale_pyramid",
    "3 trillion": "scale_pyramid",
    "parameter scale": "scale_pyramid",
    "larger models": "scale_pyramid"
}

QA_DB = """
export const qaDatabase = {
    "chemdfm": "ChemDFM is a 13B-parameter foundation model trained on 34 billion tokens from 3.8 million chemistry papers and 1,400 textbooks, then fine-tuned with 2.7 million instructions. According to arXiv:2401.14818, it outperforms GPT-4 on chemical benchmarks because it understands SMILES notation natively—it literally 'speaks chemistry' as a language.",
    "retrosynthesis": "Retrosynthesis is the art of working backwards—starting with a complex target molecule and breaking it down into simpler, commercially available precursors. The arXiv paper 2510.16590 shows how 'Atom-Anchored LLMs' achieve 90%+ accuracy by assigning unique identifiers to every atom and tracking them through reactions. This prevents the AI from 'hallucinating' atoms.",
    "alphafold": "AlphaFold is DeepMind's revolutionary AI that predicts protein 3D structures from amino acid sequences. It excels at folded proteins but struggles with 'intrinsically disordered proteins' that don't have fixed shapes (see arXiv:2502.11326). ChemDFM complements AlphaFold: one predicts structure, the other designs molecules that interact with those structures.",
    "system prompt": "A system prompt is the initial instruction set given to an AI that shapes its behavior. In chemistry (arXiv:2505.07027), prompts like 'conserve mass' and 'follow valency rules' ensure the AI doesn't suggest impossible reactions. It's like giving the AI its 'chemistry rulebook' before it starts work.",
    "ai model": "An AI model in chemistry is a computational system trained on molecular data to perform tasks like property prediction, reaction planning, and molecular design. Types include Neural Networks, Graph Neural Networks (GNNs) for molecular graphs, Transformers for sequence tasks, and Foundation Models like ChemDFM for general chemistry reasoning.",
    "llm": "Large Language Models treat molecules as a language. By training on SMILES strings—text representations of molecules—they learn the 'grammar' of chemical bonds. LLM-Syn-Planner from arXiv:2505.07027 combines LLM reasoning with evolutionary search to plan complete synthesis routes in minutes rather than days.",
    "mcts": "Monte Carlo Tree Search (MCTS) is a search algorithm used in LLM-augmented synthesis design. It explores the vast space of possible reaction pathways by sampling probabilistically. Combined with LLM chemical knowledge, it enables efficient multi-step synthesis planning.",
    "atom anchor": "Atom-Anchored LLMs (arXiv:2510.16590) assign unique IDs to every atom and track them through reactions. This ensures mass conservation—no atoms appear or disappear. The approach achieves ≥90% accuracy in identifying reaction sites without needing labeled training data.",
    "evolution": "AI in chemistry evolved from rule-based expert systems (1980s-90s) to statistical machine learning (2000s) to deep learning (2012+) to today's foundation models. The key shift was from humans writing rules to machines learning patterns from data automatically.",
    "default": "Great question! My presentation covered AI evolution in chemistry, system prompts, ChemDFM, retrosynthesis, and more. For detailed sources, check out arXiv papers 2505.07027 (LLM-Augmented Synthesis), 2401.14818 (ChemDFM), 2510.16590 (Atom-Anchored LLMs), and 2502.11326 (IDPForge)."
};
"""

def parse_time(time_str):
    """Converts '00:00:03,360' -> seconds (float)"""
    h, m, s_ms = time_str.split(':')
    s, ms = s_ms.split(',')
    return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000.0

def clean_text(text):
    """Removes HTML tags like <font> and clean up whitespace."""
    text = re.sub(r'<[^>]+>', '', text)
    return text.strip()

def parse_srt(filename):
    """Parses SRT file into grouped segments (deduplicates repeated lines)."""
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    blocks = re.split(r'\n\n+', content.strip())
    
    raw_segments = []
    
    for block in blocks:
        lines = block.split('\n')
        if len(lines) >= 3:
            time_line = lines[1]
            text_lines = lines[2:]
            
            match = re.search(r'(\d{2}:\d{2}:\d{2},\d{3}) -->', time_line)
            if match:
                start_time = parse_time(match.group(1))
                text = " ".join(text_lines)
                cleaned_text = clean_text(text)
                
                if cleaned_text:
                    raw_segments.append({
                        'startTime': start_time,
                        'text': cleaned_text
                    })
    
    # Group by unique text with earliest timestamp
    grouped = {}
    for seg in raw_segments:
        text = seg['text']
        if text not in grouped:
            grouped[text] = seg['startTime']
        else:
            # Keep earliest timestamp
            grouped[text] = min(grouped[text], seg['startTime'])
    
    # Convert back to list and sort by time
    segments = [{'startTime': t, 'text': txt, 'sender': 'bot'} for txt, t in grouped.items()]
    segments.sort(key=lambda x: x['startTime'])
    
    return segments

def assign_visuals(segments):
    """Assign visual types based on keywords."""
    for segment in segments:
        text = segment['text']
        for keyword, visual_type in VISUAL_MAPPINGS.items():
            if keyword.lower() in text.lower():
                if 'visualType' not in segment:
                    segment['visualType'] = visual_type
    
    # Ensure first segment has a visual
    if segments and 'visualType' not in segments[0]:
        segments[0]['visualType'] = 'scene_init'
    
    return segments

def generate_js(segments):
    """Generate JavaScript output."""
    output = "export const presentationScript = [\n"
    
    for seg in segments:
        visual_str = f",\n      visualType: '{seg['visualType']}'" if 'visualType' in seg else ""
        text_safe = seg['text'].replace('"', '\\"').replace("'", "\\'")
        output += f"    {{ startTime: {seg['startTime']}, text: \"{text_safe}\", sender: '{seg['sender']}'{visual_str} }},\n"
    
    output += "];\n"
    output += QA_DB
    
    return output

def main():
    try:
        segments = parse_srt(TRANSCRIPT_FILE)
    except FileNotFoundError:
        print(f"// Error: Could not find {TRANSCRIPT_FILE}", file=sys.stderr)
        return
    
    segments = assign_visuals(segments)
    js_output = generate_js(segments)
    
    # Print ONLY the JS content (no debug messages)
    print(js_output)

if __name__ == "__main__":
    main()
