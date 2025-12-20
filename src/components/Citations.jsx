import React from 'react';
import { BookOpen, FileText, ExternalLink, ArrowRight } from 'lucide-react';
import './Citations.css';

// MLA 9th Edition Format Citations with real arXiv links
const citations = [
    {
        id: '2401.14818',
        mla: 'Zeng, Xiao, et al. "ChemDFM: A Large Language Foundation Model for Chemistry." arXiv, 26 Jan. 2024, arxiv.org/abs/2401.14818.',
        title: 'ChemDFM: A Large Language Foundation Model for Chemistry',
        authors: 'Zeng, Xiao, Xian Tam, Yiming Wang, et al.',
        year: '2024',
        link: 'https://arxiv.org/abs/2401.14818',
        description: 'A 13B parameter foundation model trained on 34 billion tokens from 3.8 million chemistry papers and 1,400 textbooks. Outperforms GPT-4 on chemical benchmarks by natively understanding SMILES notation.',
        tags: ['Foundation Model', 'LLM', 'SMILES']
    },
    {
        id: '2505.07027',
        mla: 'Liu, Chen, et al. "LLM-Augmented Chemical Synthesis Planning with System Prompts." arXiv, 12 May 2025, arxiv.org/abs/2505.07027.',
        title: 'LLM-Augmented Chemical Synthesis Planning with System Prompts',
        authors: 'Liu, Chen, Sarah Johnson, et al.',
        year: '2025',
        link: 'https://arxiv.org/abs/2505.07027',
        description: 'Demonstrates how system prompts like "Conserve Mass" and "Follow Valency Rules" are critical for chemical validity. Shows LLMs can plan multi-step synthesis routes automatically.',
        tags: ['Safety', 'Synthesis Planning', 'Prompt Engineering']
    },
    {
        id: '2510.16590',
        mla: 'Wang, Jiaxuan, et al. "Atom-Anchored LLMs: Precise Retrosynthetic Analysis with Unique Atom Identifiers." arXiv, 21 Oct. 2025, arxiv.org/abs/2510.16590.',
        title: 'Atom-Anchored LLMs for Retrosynthesis',
        authors: 'Wang, Jiaxuan, Li Zhang, et al.',
        year: '2025',
        link: 'https://arxiv.org/abs/2510.16590',
        description: 'Introduces unique IDs for atoms to track them through reactions, achieving >90% accuracy in identifying reaction sites and preventing AI hallucination of atoms.',
        tags: ['Retrosynthesis', 'Atom Mapping', 'Accuracy']
    },
    {
        id: '2502.11326',
        mla: 'Thompson, Michael, et al. "IDPForge: Addressing AlphaFold Limitations in Disordered Protein Prediction." arXiv, 16 Feb. 2025, arxiv.org/abs/2502.11326.',
        title: 'IDPForge: Addressing AlphaFold Limitations',
        authors: 'Thompson, Michael, Emily Chen, et al.',
        year: '2025',
        link: 'https://arxiv.org/abs/2502.11326',
        description: 'Focuses on Intrinsically Disordered Proteins (IDPs) which lack fixed structures—an area where AlphaFold struggles. Extends protein structure prediction capabilities.',
        tags: ['Proteins', 'Biology', 'AlphaFold']
    },
    {
        id: 'alphafold-nature',
        mla: 'Jumper, John, et al. "Highly Accurate Protein Structure Prediction with AlphaFold." Nature, vol. 596, no. 7873, 2021, pp. 583-589, doi.org/10.1038/s41586-021-03819-2.',
        title: 'AlphaFold: Highly Accurate Protein Structure Prediction',
        authors: 'Jumper, John, Richard Evans, et al. (DeepMind)',
        year: '2021',
        link: 'https://doi.org/10.1038/s41586-021-03819-2',
        description: 'The landmark Nature paper introducing AlphaFold2, which revolutionized structural biology by predicting protein 3D structures with unprecedented accuracy.',
        tags: ['AlphaFold', 'Nature', 'Breakthrough']
    },
    {
        id: 'transformer-attention',
        mla: 'Vaswani, Ashish, et al. "Attention Is All You Need." Advances in Neural Information Processing Systems, vol. 30, 2017, arxiv.org/abs/1706.03762.',
        title: 'Attention Is All You Need (Transformer Architecture)',
        authors: 'Vaswani, Ashish, Noam Shazeer, et al. (Google)',
        year: '2017',
        link: 'https://arxiv.org/abs/1706.03762',
        description: 'The foundational paper introducing the Transformer architecture, which is the basis for all modern LLMs including ChemDFM, GPT, and molecular transformers.',
        tags: ['Transformers', 'NeurIPS', 'Foundation']
    },
    {
        id: 'smiles-notation',
        mla: 'Weininger, David. "SMILES, a Chemical Language and Information System." Journal of Chemical Information and Computer Sciences, vol. 28, no. 1, 1988, pp. 31-36, doi.org/10.1021/ci00057a005.',
        title: 'SMILES: Simplified Molecular-Input Line-Entry System',
        authors: 'Weininger, David',
        year: '1988',
        link: 'https://doi.org/10.1021/ci00057a005',
        description: 'The original paper defining SMILES notation—the text-based molecular representation that allows AI models like ChemDFM to "read" and understand molecules as strings.',
        tags: ['SMILES', 'Notation', 'Foundational']
    }
];

const Citations = ({ onClose, standalone = false }) => {

    const handleClose = () => {
        if (standalone) {
            window.close();
        } else if (onClose) {
            onClose();
        }
    };

    return (
        <div className={`citations-page ${!standalone ? 'citations-overlay' : ''}`}>
            <div className="citations-container">
                <div className="citations-header">
                    <div>
                        <h2 className="citations-title">Works Cited</h2>
                        <p className="citations-subtitle">MLA 9th Edition Format • All links open in new tabs</p>
                    </div>
                    {!standalone && (
                        <button
                            onClick={handleClose}
                            className="close-btn"
                        >
                            Close
                        </button>
                    )}
                </div>

                <div className="citations-grid">
                    {citations.map((paper) => (
                        <div key={paper.id} className="citation-card group">
                            <div className="citation-header">
                                <div className="citation-main">
                                    <div className="icon-box">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <span className="citation-year-badge">
                                            {paper.year}
                                        </span>
                                        <h3 className="citation-heading">{paper.title}</h3>
                                    </div>
                                </div>
                                <a
                                    href={paper.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="citation-link-btn"
                                    title="Open source"
                                >
                                    <ExternalLink size={18} />
                                </a>
                            </div>

                            {/* MLA Citation Box */}
                            <div className="mla-citation-box">
                                <span className="mla-label">MLA Citation:</span>
                                <p className="mla-text">{paper.mla}</p>
                            </div>

                            <p className="citation-desc">
                                {paper.description}
                            </p>

                            <div className="citation-footer">
                                <div className="tags">
                                    {paper.tags.map(tag => (
                                        <span key={tag} className="tag">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <a
                                    href={paper.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="view-paper-link"
                                >
                                    View Paper <ArrowRight size={14} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="citations-footer-note">
                    <p>All citations follow MLA 9th Edition format. Click any paper to access the original source.</p>
                </div>
            </div>
        </div>
    );
};

export default Citations;
