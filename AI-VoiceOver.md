> **My first project**
>
> We all have a love and hate relationship with AI. Whether it\'s
> cranking out the essay due in one minute or generating a lesson plan
> in seconds. But have you ever stopped to think about how AI is quietly
> revolutionizing the entire chemical industry, from designing
> lifesaving drugs to predicting how molecules behave? AI is changing
> chemistry in ways that we\'ve never imagined before. And that\'s
> exactly what I\'m going to explore today. And as you know, I major.
> And welcome to my presentation on advances in chemistry with AI. So
> let\'s start out with a simple question what is AI? What is actually
> artificial intelligence? You know, so AI refers to computer systems
> which are designed to perform tasks that typically require human
> intelligence. And they learn from experience, recognizing patterns,
> making decisions, and even understanding the language. But in
> chemistry, AI isn\'t just a buzzword. It\'s a practical toolkit that
> helps scientists predict molecular properties, design new drugs
> plants, synthesis routes, and analyze massive reaction datasets. So
> there is different types of AI models. So what AI models are chemists
> actually using today? Now let\'s let\'s break it down. Here\'s a
> visualization showing how AI model performance has evolved over time.
> And there are several key model types. Number one we have neural
> networks for property prediction. Number two we have graph neural
> networks that understand molecular structures and transformers that
> treat molecules like a language. So here\'s what a neural network
> architecture looks like. The building block of modern chemical AI. So
> unlike traditional computers that follow explicit rules and that are
> just built off of transistors, these AI models actually learn from
> data. So they train a neural network on millions of molecules. So a
> neural network is a type of long branches of data set change. And it
> allows the AI to think and go in different directions. It\'s like a
> brain. And it can predict properties of compounds that it\'s never
> seen before. Using certain rules we have in chemistry. It knows all
> the exceptions, all the rules that we have learned so far in
> chemistry. Now let\'s trace it back to how AI in chemistry has
> evolved. And this didn\'t happen overnight. Believe it or not, it
> started in the ancient periods of 1980s and 1990s. We have had rule
> based expert systems. Basically, chemists wrote down rules and
> computers followed them. Simple but inflexible. By the 2000,
> statistical machines emerged and models learned patterns from data,
> but still needed humans to design the features. The real evolution
> came after 2012 with deep learning. Neural networks started learning
> features automatically, and this is when AlphaFold began changing
> protein and science. Now, AlphaFold is a model created by Google, and
> the main purpose is to predict protein structures. So today in 2025,
> we have foundation models that are like AlphaFold. And then we have
> large language models like cam DFM. Now that can reason. Those models
> can reason about chemistry where instead of speaking the language of
> proteins is speaking the language of models, and it\'s trying to make
> connections to different chemistry materials. So speaking of language
> models, let me explain something crucial. So insistent prompts. And
> you\'ve heard of system prompts probably before you know what a prompt
> is. But a system prompt is something an AI model is given in the
> backbone. And it\'s kind of like its true purpose in life. So a system
> prompt is like an initial set of instructions given to an AI model
> before it interacts with the user. So think of it as like a
> personality programming that shapes how the response for a chemical
> LM, the system prompt might say always conserve mass. Follow valency
> rules. Carbon forms for bonds. Prioritize non-toxic reagents. Site
> your confidence level. So, according to the arXiv paper 2505.07027,
> which is about system prompt, is very critical for ensuring chemical
> validity. So without those, an AI might suggest reactions that violate
> the fundamental laws of chemistry like creating atoms out of nothing,
> conservation of energy, and all other aspects. Also, you have LLM
> augmented synthesis with the right prompts. AI models can do something
> very remarkable. They can plan the entire synthesis rounds
> automatically. So the stuff we\'ve been doing in organic chemistry,
> creating multi-step an AI model can do it instantly without anyone
> being involved in it. So, as we know, traditional synthesis requires
> significant planning hours and hours of work by chemists trying to see
> what they have and what they need and work backwards from a target
> molecule. But it takes hours, even days. And out of them, augmented
> systems like LM. S Wind Planner from the arXiv 2505.07027 uses
> evolutionary search combined with LM reasoning to generate and
> optimize complete retro synthesis pathways in minutes. Here\'s a
> visualization of how AI plants a reaction pathway. Now let\'s talk
> about the specific breakthrough that we\'ve been talking about over a
> long period of time. Chem DFM. So the Chemical Dialogue Foundation
> model, which is, according to the arXiv paper to 401.14818 cam DFM was
> trained on 34 billion tokens from over 3.8 million chemistry papers
> and 1400 textbooks. It was then fine tuned with 2.7 million chemical
> instructions. This means that the model can now think with the
> capacity of over a million scientists. So let\'s visualize a molecular
> structure that can DFM can analyze in real time. Now what makes chem
> DFM special? Why can\'t we use Gemini or GPT four or GPT five? So GPT
> four and GPT five treats chemistry as regular text. But can DFM
> understands smiles? Notation. This is a way that chemists write
> molecules as text strings, and it speaks chemistry natively. Its first
> language is chemistry. Now here\'s what\'s super interesting. Despite
> being only 13 billion parameters, which is actually small for a model.
> Models like ChatGPT and GPT five and Gemini are over 1.5 trillion, and
> even goes up to 5 trillion for parameters and parameters. Is the
> capacity of those neural networks how many connections that neural
> network can make? So can DFM actually outperforms GPT five and current
> Gemini platforms on chemical benchmarks? The size of the model isn\'t
> everything. This is what matters. Specification, specialization, and
> understanding the actual content and being trained on it. What it\'s
> what matters. And this is what research has found out. So how does cam
> DFM compare to the AlphaFold models we\'ve had before. And they\'re so
> and they\'re actually complementary and not competitors. So you\'ve
> probably heard about AlphaFold. As I said before, AlphaFold predicts
> what a protein looks like. You know, folding amino acids sequences
> into 3D structures. It revolutionized structural biology. And here\'s
> a protein structure visualization, the kind of output AlphaFold
> produces. Can DFM, on the other hand, focuses on chemical synthesis
> and reasoning. It helps design molecules that interact with proteins
> one predict structure and the other designs function. So AlphaFold
> predicts the structure and DFM designs the function. So the arXiv
> paper of 250.2502.11326 on IDP four actually addresses Alpha force
> limitations. It struggles with disordered proteins that don\'t have
> fixed structures. The field keeps pushing forward to go over this
> barrier. So finally, let\'s talk about retro synthesis. It\'s one of
> the most exciting applications of AI in chemistry. Now ratio synthesis
> is the art of working backwards. So you start with a complex surrogate
> molecule and you break it down step by step into simpler, commercially
> available starting materials. It\'s kind of similar to what we did in
> organic chemistry. And the breakthrough from arXiv 2510.16590 is atom
> anchored atoms, so these models design unique identifiers to every
> atom in a molecule, and they track them through the reaction. This
> atom level reasoning achieves over 90% accuracy in identifying where
> reactions should happen. And 94% accuracy in predicting the final
> reactions so no atoms are lost or magically created. So let me show
> you something interactive. This simulation demonstrates collision
> theory and how temperatures and concentration effects rate reaction
> rates. So we focus on collision theory a lot and this will help
> visualize that. So to summarize everything we\'ve covered today, AI
> and chemistry has evolved from simple rule based systems to powerful
> foundation models like Cam, DFM and system prompts ensure chemical
> validity, LLM augmented programs automate synthesis planning, and atom
> anchored reasoning begins and unprecedented precision to retro
> synthesis. It\'s from generating essays to revolutionizing drug
> discovery. AI is proving that its potential stretches far beyond
> beyond what we initially imagined. And in chemistry, it\'s not going
> to replace scientists any time. It\'s giving them tools, utilities
> they can use to overcome obstacles to become something more than what
> we are now. Thank you for joining my exploration of AI in chemistry.
> And this has been Americana, and I\'m pleased to show you this. Feel
> free to walk around this platform, and there\'s can be a form that you
> can actually use in real time. It uses a similar system prompt that
> chem DFM actually has, and it will help you understand the true
> workings behind the model. You can ask any questions related to
> chemistry and have fun. Thank you for watching.
