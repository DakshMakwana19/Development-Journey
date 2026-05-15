/**
 * roadmap-data.ts — Comprehensive AI/ML Learning Roadmap
 * A detailed, phase-based syllabus starting from absolute scratch.
 * Each phase has granular topics with resources and assignments.
 */

export interface RoadmapPhase {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: string;
  color: string;
  topics: RoadmapTopic[];
}

export interface RoadmapTopic {
  id: string;
  title: string;
  completed: boolean;
  resources: string[];
  assignments: string[];
}

export const ROADMAP_PHASES: RoadmapPhase[] = [
  // ════════════════════════════════════════════════════════
  // PHASE 0 — Absolute Beginner Prerequisites
  // ════════════════════════════════════════════════════════
  {
    id: 'phase-0',
    title: 'Programming & Computer Basics',
    description: 'Learn programming from scratch — Python fundamentals, logic building, and computational thinking.',
    duration: 'Weeks 1–3',
    icon: '💻',
    color: '#8b949e',
    topics: [
      { id: 't0-1', title: 'How Computers Work — CPU, Memory, Storage', completed: false, resources: ['CS50 Lecture 0', 'Crash Course Computer Science'], assignments: ['Write notes on how a program executes'] },
      { id: 't0-2', title: 'Python Installation & IDE Setup (VS Code)', completed: false, resources: ['Python.org download', 'VS Code Python setup guide'], assignments: ['Install Python 3.12+, run hello world'] },
      { id: 't0-3', title: 'Variables, Data Types & Operators', completed: false, resources: ['W3Schools Python Basics', 'Python Crash Course Ch 1-2'], assignments: ['Build a simple calculator'] },
      { id: 't0-4', title: 'Conditionals & Loops (if/else, for, while)', completed: false, resources: ['Automate the Boring Stuff Ch 2', 'HackerRank 30 Days of Code'], assignments: ['FizzBuzz, number guessing game'] },
      { id: 't0-5', title: 'Functions, Scope & Recursion', completed: false, resources: ['Python Crash Course Ch 8', 'Corey Schafer Functions video'], assignments: ['Factorial, Fibonacci, palindrome checker'] },
      { id: 't0-6', title: 'Data Structures — Lists, Tuples, Dicts, Sets', completed: false, resources: ['Python docs — Data Structures', 'Real Python Collections'], assignments: ['Contact book app, word frequency counter'] },
      { id: 't0-7', title: 'File I/O, Error Handling & Modules', completed: false, resources: ['Automate the Boring Stuff Ch 9', 'Python Crash Course Ch 10'], assignments: ['Read CSV file, write log file'] },
      { id: 't0-8', title: 'OOP Basics — Classes, Objects, Inheritance', completed: false, resources: ['Corey Schafer OOP series', 'Python Crash Course Ch 9'], assignments: ['Build a Student management system'] },
      { id: 't0-9', title: 'Git & GitHub Fundamentals', completed: false, resources: ['Git & GitHub for Beginners (freeCodeCamp)', 'GitHub Skills'], assignments: ['Create a repo, push your first project'] },
    ],
  },

  // ════════════════════════════════════════════════════════
  // PHASE 1 — Math Foundations for ML
  // ════════════════════════════════════════════════════════
  {
    id: 'phase-1',
    title: 'Mathematics for Machine Learning',
    description: 'Build the mathematical intuition needed for ML — linear algebra, calculus, probability, and statistics.',
    duration: 'Weeks 4–8',
    icon: '📐',
    color: 'var(--accent-blue)',
    topics: [
      { id: 't1-1', title: 'Linear Algebra — Vectors & Vector Operations', completed: false, resources: ['3Blue1Brown Essence of Linear Algebra (Ch 1-3)', 'Khan Academy Linear Algebra'], assignments: ['Implement vector addition, dot product in Python'] },
      { id: 't1-2', title: 'Linear Algebra — Matrices, Transformations', completed: false, resources: ['3Blue1Brown (Ch 4-7)', 'MIT OCW 18.06 Lecture 1-5'], assignments: ['Implement matrix multiplication from scratch'] },
      { id: 't1-3', title: 'Linear Algebra — Eigenvalues, SVD, PCA intuition', completed: false, resources: ['3Blue1Brown (Ch 14)', 'StatQuest PCA'], assignments: ['PCA visualization on iris dataset'] },
      { id: 't1-4', title: 'Calculus — Derivatives & Chain Rule', completed: false, resources: ['3Blue1Brown Essence of Calculus', 'Khan Academy Derivatives'], assignments: ['Compute gradients by hand, verify with Python'] },
      { id: 't1-5', title: 'Calculus — Partial Derivatives & Gradients', completed: false, resources: ['Khan Academy Multivariable Calculus', 'Deep Learning Book Ch 4'], assignments: ['Gradient of a multivariable function'] },
      { id: 't1-6', title: 'Calculus — Optimization & Gradient Descent', completed: false, resources: ['Andrew Ng gradient descent lecture', '3Blue1Brown Neural Networks Ch 2'], assignments: ['Implement gradient descent from scratch'] },
      { id: 't1-7', title: 'Probability — Basic Probability, Bayes Theorem', completed: false, resources: ['StatQuest Probability', 'Khan Academy Probability'], assignments: ['Naive Bayes spam classifier from scratch'] },
      { id: 't1-8', title: 'Statistics — Distributions, Mean, Variance, Std Dev', completed: false, resources: ['StatQuest Normal Distribution', 'Think Stats Ch 1-4'], assignments: ['Compute statistics on a real dataset'] },
      { id: 't1-9', title: 'Statistics — Hypothesis Testing, p-values, Confidence Intervals', completed: false, resources: ['StatQuest p-values', 'Khan Academy Inference'], assignments: ['A/B test analysis on sample data'] },
      { id: 't1-10', title: 'Statistics — Correlation, Regression basics', completed: false, resources: ['StatQuest Linear Regression', 'Khan Academy Regression'], assignments: ['Simple linear regression from scratch'] },
    ],
  },

  // ════════════════════════════════════════════════════════
  // PHASE 2 — Data Science & Python Libraries
  // ════════════════════════════════════════════════════════
  {
    id: 'phase-2',
    title: 'Data Science with Python',
    description: 'Master NumPy, Pandas, Matplotlib, and data manipulation for real-world datasets.',
    duration: 'Weeks 9–12',
    icon: '📊',
    color: 'var(--accent-teal)',
    topics: [
      { id: 't2-1', title: 'NumPy — Arrays, Broadcasting, Vectorization', completed: false, resources: ['NumPy official tutorial', 'Kaggle NumPy course'], assignments: ['Implement matrix operations using NumPy only'] },
      { id: 't2-2', title: 'Pandas — DataFrames, Indexing, Filtering', completed: false, resources: ['Kaggle Pandas course', 'Pandas official 10 min guide'], assignments: ['Load and explore a CSV dataset'] },
      { id: 't2-3', title: 'Pandas — GroupBy, Merge, Pivot, Time Series', completed: false, resources: ['Real Python Pandas GroupBy', 'Kaggle advanced Pandas'], assignments: ['Sales data aggregation & analysis'] },
      { id: 't2-4', title: 'Data Cleaning — Missing values, Outliers, Encoding', completed: false, resources: ['Kaggle Data Cleaning course', 'Towards Data Science articles'], assignments: ['Clean Titanic dataset end-to-end'] },
      { id: 't2-5', title: 'Matplotlib & Seaborn — Visualization', completed: false, resources: ['Matplotlib tutorial', 'Seaborn gallery'], assignments: ['Create 10 different chart types'] },
      { id: 't2-6', title: 'Exploratory Data Analysis (EDA) Process', completed: false, resources: ['Kaggle EDA notebooks', 'IBM Data Science methodology'], assignments: ['Full EDA on House Prices dataset'] },
      { id: 't2-7', title: 'Web Scraping with BeautifulSoup & APIs', completed: false, resources: ['Real Python Web Scraping', 'Requests library docs'], assignments: ['Scrape data and create a dataset'] },
      { id: 't2-8', title: 'SQL Basics for Data Science', completed: false, resources: ['SQLBolt interactive tutorial', 'Mode Analytics SQL'], assignments: ['Write 20 SQL queries on sample database'] },
    ],
  },

  // ════════════════════════════════════════════════════════
  // PHASE 3 — Machine Learning Fundamentals
  // ════════════════════════════════════════════════════════
  {
    id: 'phase-3',
    title: 'Machine Learning Fundamentals',
    description: 'Understand core ML algorithms, model training, evaluation, and the complete ML pipeline.',
    duration: 'Weeks 13–20',
    icon: '🤖',
    color: 'var(--accent-purple)',
    topics: [
      { id: 't3-1', title: 'What is ML? — Types, Applications, Workflow', completed: false, resources: ['Andrew Ng Coursera Week 1', 'Google ML Crash Course Intro'], assignments: ['Write a summary of ML types with examples'] },
      { id: 't3-2', title: 'Linear Regression — Theory & Implementation', completed: false, resources: ['Andrew Ng Week 2', 'StatQuest Linear Regression'], assignments: ['Implement from scratch + Scikit-learn comparison'] },
      { id: 't3-3', title: 'Logistic Regression & Classification', completed: false, resources: ['Andrew Ng Week 3', 'StatQuest Logistic Regression'], assignments: ['Binary classifier on Breast Cancer dataset'] },
      { id: 't3-4', title: 'Decision Trees & Random Forests', completed: false, resources: ['StatQuest Decision Trees', 'Scikit-learn docs'], assignments: ['Build random forest classifier, visualize tree'] },
      { id: 't3-5', title: 'SVM — Support Vector Machines', completed: false, resources: ['MIT OCW SVM lecture', 'StatQuest SVM'], assignments: ['SVM classification with different kernels'] },
      { id: 't3-6', title: 'KNN, Naive Bayes & Ensemble Methods', completed: false, resources: ['StatQuest KNN', 'Scikit-learn Ensemble docs'], assignments: ['Compare KNN, NB, and ensemble on same data'] },
      { id: 't3-7', title: 'Model Evaluation — Accuracy, Precision, Recall, F1, ROC', completed: false, resources: ['Google ML Crash Course — Classification', 'StatQuest Confusion Matrix'], assignments: ['Evaluate models with all metrics'] },
      { id: 't3-8', title: 'Cross-Validation & Hyperparameter Tuning', completed: false, resources: ['Scikit-learn CV docs', 'StatQuest Cross Validation'], assignments: ['GridSearchCV on 3 different models'] },
      { id: 't3-9', title: 'Feature Engineering & Selection', completed: false, resources: ['Kaggle Feature Engineering course', 'Feature Engine library'], assignments: ['Feature engineering pipeline for Kaggle dataset'] },
      { id: 't3-10', title: 'Unsupervised Learning — K-Means, DBSCAN', completed: false, resources: ['StatQuest K-Means', 'Scikit-learn Clustering'], assignments: ['Customer segmentation project'] },
      { id: 't3-11', title: 'Dimensionality Reduction — PCA, t-SNE', completed: false, resources: ['StatQuest PCA', 'Scikit-learn PCA tutorial'], assignments: ['Reduce MNIST to 2D and visualize'] },
      { id: 't3-12', title: 'Gradient Boosting — XGBoost, LightGBM', completed: false, resources: ['StatQuest XGBoost', 'XGBoost documentation'], assignments: ['Kaggle competition with XGBoost'] },
      { id: 't3-13', title: 'End-to-End ML Project Pipeline', completed: false, resources: ['Hands-On ML Ch 2', 'Kaggle winning solutions'], assignments: ['Complete ML project: data → model → evaluation'] },
    ],
  },

  // ════════════════════════════════════════════════════════
  // PHASE 4 — Deep Learning
  // ════════════════════════════════════════════════════════
  {
    id: 'phase-4',
    title: 'Deep Learning',
    description: 'Master neural networks from perceptrons to advanced architectures — CNNs, RNNs, and training techniques.',
    duration: 'Weeks 21–30',
    icon: '🧠',
    color: 'var(--accent-amber)',
    topics: [
      { id: 't4-1', title: 'Perceptrons & Artificial Neurons', completed: false, resources: ['3Blue1Brown Neural Networks Ch 1', 'Deep Learning Book Ch 6'], assignments: ['Build a perceptron from scratch'] },
      { id: 't4-2', title: 'Multi-Layer Networks & Backpropagation', completed: false, resources: ['3Blue1Brown Ch 2-4', 'Andrej Karpathy micrograd'], assignments: ['Implement backprop from scratch in NumPy'] },
      { id: 't4-3', title: 'Activation Functions — ReLU, Sigmoid, Tanh, Softmax', completed: false, resources: ['Deep Learning Book Ch 6.3', 'Papers With Code activations'], assignments: ['Compare activations on a classification task'] },
      { id: 't4-4', title: 'Loss Functions & Optimizers (SGD, Adam, RMSprop)', completed: false, resources: ['Deep Learning Book Ch 8', 'Sebastian Ruder optimizer overview'], assignments: ['Train networks with different optimizers'] },
      { id: 't4-5', title: 'PyTorch Fundamentals — Tensors, Autograd, nn.Module', completed: false, resources: ['PyTorch 60-minute blitz', 'Fast.ai Practical DL Lesson 1'], assignments: ['Rebuild MNIST classifier in PyTorch'] },
      { id: 't4-6', title: 'Regularization — Dropout, BatchNorm, Weight Decay', completed: false, resources: ['Deep Learning Book Ch 7', 'Srivastava et al. Dropout paper'], assignments: ['Train with/without regularization, compare'] },
      { id: 't4-7', title: 'CNNs — Convolution, Pooling, Architecture', completed: false, resources: ['CS231n Lectures 5-9', 'CNN Explainer visualization'], assignments: ['Build CNN for CIFAR-10 classification'] },
      { id: 't4-8', title: 'CNN Architectures — LeNet, AlexNet, VGG, ResNet', completed: false, resources: ['Papers With Code — Image Classification', 'CS231n Lecture 9'], assignments: ['Implement ResNet from scratch'] },
      { id: 't4-9', title: 'RNNs — Sequence Models, Vanishing Gradients', completed: false, resources: ['CS224n Lecture 5', 'Illustrated RNN (Jay Alammar)'], assignments: ['Build character-level text generator'] },
      { id: 't4-10', title: 'LSTM & GRU Networks', completed: false, resources: ['Chris Olah LSTM blog', 'PyTorch LSTM tutorial'], assignments: ['Sentiment analysis with LSTM'] },
      { id: 't4-11', title: 'Transfer Learning & Fine-tuning', completed: false, resources: ['PyTorch Transfer Learning tutorial', 'Fast.ai Lesson 1-2'], assignments: ['Fine-tune ResNet on custom image dataset'] },
      { id: 't4-12', title: 'Data Augmentation & Training Techniques', completed: false, resources: ['Albumentations library', 'Fast.ai data augmentation'], assignments: ['Improve model accuracy with augmentation'] },
    ],
  },

  // ════════════════════════════════════════════════════════
  // PHASE 5 — NLP & Transformers
  // ════════════════════════════════════════════════════════
  {
    id: 'phase-5',
    title: 'NLP & Transformers',
    description: 'Learn natural language processing from basics to transformers, BERT, GPT, and large language models.',
    duration: 'Weeks 31–38',
    icon: '📝',
    color: 'var(--accent-green)',
    topics: [
      { id: 't5-1', title: 'NLP Basics — Tokenization, Stemming, Lemmatization', completed: false, resources: ['NLTK Book Ch 1-3', 'spaCy 101 tutorial'], assignments: ['Build a text preprocessing pipeline'] },
      { id: 't5-2', title: 'Text Representation — BoW, TF-IDF', completed: false, resources: ['Scikit-learn text tutorial', 'Towards DS TF-IDF guide'], assignments: ['Document classification with TF-IDF'] },
      { id: 't5-3', title: 'Word Embeddings — Word2Vec, GloVe, FastText', completed: false, resources: ['Word2Vec paper (Mikolov)', 'Jay Alammar Word2Vec'], assignments: ['Train Word2Vec on custom corpus'] },
      { id: 't5-4', title: 'Sequence-to-Sequence Models & Attention', completed: false, resources: ['Jay Alammar Seq2Seq + Attention', 'CS224n Lecture 7'], assignments: ['Build a simple machine translator'] },
      { id: 't5-5', title: 'Transformer Architecture — Self-Attention', completed: false, resources: ['Illustrated Transformer (Jay Alammar)', 'Attention Is All You Need paper'], assignments: ['Implement self-attention from scratch'] },
      { id: 't5-6', title: 'BERT — Pretraining, Fine-tuning, Applications', completed: false, resources: ['Jay Alammar Illustrated BERT', 'HuggingFace BERT tutorial'], assignments: ['Fine-tune BERT for text classification'] },
      { id: 't5-7', title: 'GPT Family — GPT-2, GPT-3, GPT-4 concepts', completed: false, resources: ['Jay Alammar Illustrated GPT-2', 'OpenAI blog posts'], assignments: ['Generate text with GPT-2 using HuggingFace'] },
      { id: 't5-8', title: 'HuggingFace Transformers Library', completed: false, resources: ['HuggingFace Course (free)', 'HuggingFace docs'], assignments: ['Use 5 different pre-trained models for NLP tasks'] },
      { id: 't5-9', title: 'LLMs & Prompt Engineering', completed: false, resources: ['OpenAI Cookbook', 'Prompt Engineering Guide (DAIR.AI)'], assignments: ['Build prompt templates for different tasks'] },
      { id: 't5-10', title: 'RAG — Retrieval-Augmented Generation', completed: false, resources: ['LangChain RAG tutorial', 'LlamaIndex docs'], assignments: ['Build a RAG chatbot over your own documents'] },
    ],
  },

  // ════════════════════════════════════════════════════════
  // PHASE 6 — Computer Vision (Detailed)
  // ════════════════════════════════════════════════════════
  {
    id: 'phase-6',
    title: 'Computer Vision',
    description: 'Dive deeper into image processing, object detection, segmentation, and generative models.',
    duration: 'Weeks 39–44',
    icon: '👁️',
    color: 'var(--accent-indigo)',
    topics: [
      { id: 't6-1', title: 'Image Processing Basics — OpenCV', completed: false, resources: ['OpenCV Python tutorial', 'PyImageSearch crash course'], assignments: ['Image filters, edge detection, transformations'] },
      { id: 't6-2', title: 'Object Detection — YOLO, SSD, Faster R-CNN', completed: false, resources: ['YOLO paper', 'Ultralytics YOLOv8 docs'], assignments: ['Train YOLOv8 on custom dataset'] },
      { id: 't6-3', title: 'Image Segmentation — U-Net, Mask R-CNN', completed: false, resources: ['U-Net paper', 'Detectron2 tutorial'], assignments: ['Semantic segmentation on medical images'] },
      { id: 't6-4', title: 'GANs — Generative Adversarial Networks', completed: false, resources: ['GAN paper (Goodfellow)', 'PyTorch GAN tutorial'], assignments: ['Generate faces with DCGAN'] },
      { id: 't6-5', title: 'Diffusion Models — Stable Diffusion basics', completed: false, resources: ['Illustrated Stable Diffusion (Jay Alammar)', 'HuggingFace Diffusers'], assignments: ['Generate images with Stable Diffusion pipeline'] },
      { id: 't6-6', title: 'Vision Transformers (ViT)', completed: false, resources: ['An Image is Worth 16x16 Words paper', 'HuggingFace ViT'], assignments: ['Compare ViT vs CNN on image classification'] },
    ],
  },

  // ════════════════════════════════════════════════════════
  // PHASE 7 — MLOps & Deployment
  // ════════════════════════════════════════════════════════
  {
    id: 'phase-7',
    title: 'MLOps & Deployment',
    description: 'Learn to deploy, monitor, and maintain ML models in production environments.',
    duration: 'Weeks 45–50',
    icon: '🚀',
    color: 'var(--accent-rose)',
    topics: [
      { id: 't7-1', title: 'ML Experiment Tracking — MLflow, W&B', completed: false, resources: ['MLflow official tutorial', 'Weights & Biases quickstart'], assignments: ['Track experiments with MLflow'] },
      { id: 't7-2', title: 'Model Serving — FastAPI, Flask', completed: false, resources: ['FastAPI ML deployment tutorial', 'Flask REST API guide'], assignments: ['Deploy model as REST API'] },
      { id: 't7-3', title: 'Docker for ML — Containerization', completed: false, resources: ['Docker official tutorial', 'Full Stack Deep Learning'], assignments: ['Dockerize an ML API'] },
      { id: 't7-4', title: 'Cloud Deployment — AWS/GCP/Azure basics', completed: false, resources: ['AWS SageMaker tutorial', 'GCP Vertex AI quickstart'], assignments: ['Deploy model on a cloud platform'] },
      { id: 't7-5', title: 'CI/CD for ML — GitHub Actions, DVC', completed: false, resources: ['DVC tutorial', 'GitHub Actions for ML pipelines'], assignments: ['Set up automated model retraining'] },
      { id: 't7-6', title: 'Model Monitoring — Data Drift, Performance', completed: false, resources: ['Evidently AI docs', 'NannyML tutorial'], assignments: ['Build monitoring dashboard'] },
      { id: 't7-7', title: 'Streamlit & Gradio — ML Web Apps', completed: false, resources: ['Streamlit official docs', 'Gradio quickstart'], assignments: ['Build interactive ML demo app'] },
    ],
  },

  // ════════════════════════════════════════════════════════
  // PHASE 8 — Advanced & Specialization
  // ════════════════════════════════════════════════════════
  {
    id: 'phase-8',
    title: 'Advanced Topics & Career',
    description: 'Explore cutting-edge research, build a portfolio, contribute to open source, and prepare for interviews.',
    duration: 'Weeks 51+',
    icon: '⚡',
    color: 'var(--accent-amber)',
    topics: [
      { id: 't8-1', title: 'Reinforcement Learning — Q-Learning, Policy Gradient', completed: false, resources: ['Sutton & Barto book (free)', 'David Silver RL lectures'], assignments: ['Train an RL agent to play CartPole'] },
      { id: 't8-2', title: 'Graph Neural Networks (GNNs)', completed: false, resources: ['Stanford CS224W', 'PyG (PyTorch Geometric) tutorial'], assignments: ['Node classification with GNN'] },
      { id: 't8-3', title: 'Multi-modal AI — Text + Image models', completed: false, resources: ['CLIP paper', 'HuggingFace multi-modal docs'], assignments: ['Build image search with CLIP embeddings'] },
      { id: 't8-4', title: 'AI Agents & Autonomous Systems', completed: false, resources: ['LangChain Agents docs', 'AutoGPT concepts'], assignments: ['Build a multi-tool AI agent'] },
      { id: 't8-5', title: 'Research Paper Reading & Implementation', completed: false, resources: ['Papers With Code', 'Yannic Kilcher YouTube'], assignments: ['Implement a 2024/2025 paper from scratch'] },
      { id: 't8-6', title: 'Portfolio Building & Open Source', completed: false, resources: ['GitHub profile guide', 'Technical blogging tips'], assignments: ['3 polished projects on GitHub with READMEs'] },
      { id: 't8-7', title: 'ML System Design & Interview Prep', completed: false, resources: ['ML System Design Interview book', 'Chip Huyen blog'], assignments: ['Mock ML system design: recommendation engine'] },
    ],
  },
];

// ── Persistence for roadmap progress ──
const ROADMAP_KEY = 'aiml_roadmap_progress';

export function getRoadmapProgress(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try { const raw = localStorage.getItem(ROADMAP_KEY); return raw ? JSON.parse(raw) : {}; }
  catch { return {}; }
}

export function saveRoadmapProgress(progress: Record<string, boolean>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ROADMAP_KEY, JSON.stringify(progress));
}

export function toggleTopicCompletion(topicId: string) {
  const progress = getRoadmapProgress();
  progress[topicId] = !progress[topicId];
  saveRoadmapProgress(progress);
  return progress;
}

export function getPhaseCompletion(phase: RoadmapPhase, progress: Record<string, boolean>): number {
  const completed = phase.topics.filter(t => progress[t.id]).length;
  return Math.round((completed / phase.topics.length) * 100);
}

export function getOverallRoadmapCompletion(progress: Record<string, boolean>): number {
  const totalTopics = ROADMAP_PHASES.reduce((sum, p) => sum + p.topics.length, 0);
  const completed = Object.values(progress).filter(Boolean).length;
  return Math.round((completed / totalTopics) * 100);
}
