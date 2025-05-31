// Define the mock functions at the very top.
// mockActualPromptFunction is what the source code's 'prompt' variable should become.
const mockActualPromptFunction = jest.fn();
// definePromptMock is the mock for ai.definePrompt itself.
const definePromptMock = jest.fn(() => mockActualPromptFunction);
// defineFlowMock is the mock for ai.defineFlow.
const defineFlowMock = jest.fn((config, fn) => fn);

jest.mock('@/ai/genkit', () => ({
  ai: {
    definePrompt: definePromptMock,
    defineFlow: defineFlowMock,
  },
}));

// Module-under-test and mocked 'ai' will be imported dynamically in beforeEach.

describe('refineSnackRecommendation', () => {
  let refineSnackRecommendationFunction: (input: any) => Promise<any>;
  // We will use definePromptMock directly for assertions on ai.definePrompt

  beforeEach(async () => {
    jest.resetModules(); // Reset module cache to ensure fresh imports

    // Clear all mock call histories
    mockActualPromptFunction.mockClear();
    definePromptMock.mockClear();
    defineFlowMock.mockClear();

    // Ensure mocks are configured correctly for each run
    // (jest.mock above handles initial setup, but resetModules might require re-establishing instance if not careful)
    // Our current jest.mock directly uses these top-level consts, which is fine.

    // Dynamically import the module under test to ensure it gets the fresh mocks
    const flowModule = await import('./snack-recommendation-refinement');
    refineSnackRecommendationFunction = flowModule.refineSnackRecommendation;

    // Note: If we needed to assert against the 'ai' object from '@/ai/genkit' directly in tests,
    // we'd import it here too: const { ai } = await import('@/ai/genkit');
    // And then use that 'ai.definePrompt' (which would be definePromptMock) for spy setup if needed.
    // For current tests, directly using definePromptMock and mockActualPromptFunction is sufficient.
  });

  it('should refine snack recommendations for happy mood in USA', async () => {
    const input = { mood: 'happy', region: 'USA', initialSnackSuggestions: 'chips, chocolate' };
    const expectedOutput = { refinedSnackSuggestions: 'pretzels, dark chocolate' };

    mockActualPromptFunction.mockResolvedValue({ output: expectedOutput });

    const result = await refineSnackRecommendationFunction(input); // Use dynamically imported function
    expect(result).toEqual(expectedOutput);

    expect(definePromptMock).toHaveBeenCalledTimes(1); // ai.definePrompt was called
    expect(mockActualPromptFunction).toHaveBeenCalledTimes(1); // The returned prompt function was called
    expect(mockActualPromptFunction).toHaveBeenCalledWith(input);
  });

  it('should refine snack recommendations for sad mood in Canada with empty initial suggestions', async () => {
    const input = { mood: 'sad', region: 'Canada', initialSnackSuggestions: '' };
    const expectedOutput = { refinedSnackSuggestions: 'ice cream' };

    mockActualPromptFunction.mockResolvedValue({ output: expectedOutput });

    const result = await refineSnackRecommendationFunction(input);
    expect(result).toEqual(expectedOutput);
    expect(definePromptMock).toHaveBeenCalledTimes(1);
    expect(mockActualPromptFunction).toHaveBeenCalledTimes(1);
    expect(mockActualPromptFunction).toHaveBeenCalledWith(input);
  });

  it('should call ai.definePrompt with correct definition-time args and the returned prompt with runtime input', async () => {
    const input = { mood: 'energetic', region: 'UK', initialSnackSuggestions: 'fruit salad' };
    const mockOutput = { refinedSnackSuggestions: 'energy bar' };

    mockActualPromptFunction.mockResolvedValue({ output: mockOutput });

    await refineSnackRecommendationFunction(input);

    expect(definePromptMock).toHaveBeenCalledTimes(1);
    expect(definePromptMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'refineSnackRecommendationPrompt',
        prompt: expect.any(String),
        input: expect.objectContaining({ schema: expect.anything() }),
        output: expect.objectContaining({ schema: expect.anything() })
      })
    );

    expect(mockActualPromptFunction).toHaveBeenCalledTimes(1);
    expect(mockActualPromptFunction).toHaveBeenCalledWith(input);
  });
});
