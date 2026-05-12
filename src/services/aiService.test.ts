import { describe, it, expect, vi, beforeEach } from 'vitest';
import { askMandiBot } from './aiService';
import axios from 'axios';

vi.mock('axios');

describe('aiService: askMandiBot', () => {
  const mockData = [
    { state: 'Telangana', district: 'WGL', market: 'M1', commodity: 'Paddy', modal_price: '2000' },
    { state: 'Andhra', district: 'GNT', market: 'M2', commodity: 'Paddy', modal_price: '1800' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it('should call xAI API with correct prompt and context', async () => {
    vi.stubEnv('VITE_XAI_API_KEY', 'xai-test-key');
    const mockResponse = {
      data: {
        choices: [{ message: { content: 'The highest price is 2000.' } }]
      }
    };
    (axios.get as any).mockResolvedValue({ data: { data: [{ id: 'grok-latest' }] } });
    (axios.post as any).mockResolvedValue(mockResponse);

    const result = await askMandiBot('What is the highest price?', mockData);

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('api.x.ai'),
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({
            content: expect.stringContaining('Kisan Sahayak')
          })
        ])
      }),
      expect.any(Object)
    );
    expect(result).toBe('The highest price is 2000.');
  });

  it('should handle Groq API keys correctly', async () => {
    vi.stubEnv('VITE_XAI_API_KEY', 'gsk_test_key');
    const mockResponse = {
      data: {
        choices: [{ message: { content: 'Groq response' } }]
      }
    };
    (axios.post as any).mockResolvedValue(mockResponse);

    const result = await askMandiBot('Hello', mockData);

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('api.groq.com'),
      expect.objectContaining({
        model: 'llama-3.3-70b-versatile'
      }),
      expect.any(Object)
    );
    expect(result).toBe('Groq response');
  });

  it('should throw error if API key is missing', async () => {
    vi.stubEnv('VITE_XAI_API_KEY', '');
    // Need to reset the internal cached key if any, but since it's a fresh run or stub it should work
    await expect(askMandiBot('Hello', mockData)).rejects.toThrow('API key is missing');
  });
});
