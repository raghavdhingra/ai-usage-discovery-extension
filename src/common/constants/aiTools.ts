import type { AiTool } from '@/common/types/site';

export const AI_TOOLS: AiTool[] = [
  { toolId: 'chatgpt', name: 'ChatGPT', category: 'Chat assistant', domains: ['chatgpt.com', 'chat.openai.com'] },
  { toolId: 'claude', name: 'Claude', category: 'Chat assistant', domains: ['claude.ai'] },
  { toolId: 'gemini', name: 'Gemini', category: 'Chat assistant', domains: ['gemini.google.com'] },
  { toolId: 'copilot', name: 'Microsoft Copilot', category: 'Chat assistant', domains: ['copilot.microsoft.com', 'copilot.com'] },
  { toolId: 'meta-ai', name: 'Meta AI', category: 'Chat assistant', domains: ['meta.ai'] },
  { toolId: 'grok', name: 'Grok', category: 'Chat assistant', domains: ['grok.com'] },
  { toolId: 'deepseek', name: 'DeepSeek', category: 'Chat assistant', domains: ['chat.deepseek.com'] },
  { toolId: 'mistral', name: 'Le Chat (Mistral)', category: 'Chat assistant', domains: ['chat.mistral.ai'] },
  { toolId: 'qwen', name: 'Qwen Chat', category: 'Chat assistant', domains: ['chat.qwen.ai'] },
  { toolId: 'pi', name: 'Pi', category: 'Chat assistant', domains: ['pi.ai'] },
  { toolId: 'poe', name: 'Poe', category: 'Chat assistant', domains: ['poe.com'] },
  { toolId: 'character-ai', name: 'Character.AI', category: 'Chat assistant', domains: ['character.ai'] },
  { toolId: 'perplexity', name: 'Perplexity', category: 'AI search', domains: ['perplexity.ai'] },
  { toolId: 'notebooklm', name: 'NotebookLM', category: 'Research assistant', domains: ['notebooklm.google.com', 'notebook.google.com'] },
  { toolId: 'ai-studio', name: 'Google AI Studio', category: 'Developer AI', domains: ['aistudio.google.com'] },
];
