const mockActualPromptFunction = jest.fn();
const definePromptMock = jest.fn(() => mockActualPromptFunction);
const defineFlowMock = jest.fn((config, fn) => fn);

jest.mock('@/ai/genkit', () => ({
  ai: {
    definePrompt: definePromptMock,
    defineFlow: defineFlowMock,
  },
}));

describe('textMoodToSnack', () => {
  let textMoodToSnackFunction: (input: any) => Promise<any>;

  beforeEach(async () => {
    jest.resetModules();

    mockActualPromptFunction.mockClear();
    definePromptMock.mockClear();
    defineFlowMock.mockClear();

    const flowModule = await import('./text-mood-to-snack');
    textMoodToSnackFunction = flowModule.textMoodToSnack;
  });

  it('should suggest a snack for a happy mood description', async () => {
    const input = { moodDescription: "I'm feeling fantastic and full of energy!" };
    const expectedOutput = { mood: "ecstatic", snackSuggestion: "fruit salad", reason: "Provides natural sugars for energy and is refreshing." };

    mockActualPromptFunction.mockResolvedValue({ output: expectedOutput });

    const result = await textMoodToSnackFunction(input);
    expect(result).toEqual(expectedOutput);
    expect(definePromptMock).toHaveBeenCalledTimes(1);
    expect(mockActualPromptFunction).toHaveBeenCalledTimes(1);
    expect(mockActualPromptFunction).toHaveBeenCalledWith(input);
  });

  it('should suggest a snack for a sad mood description', async () => {
    const input = { moodDescription: "I'm feeling a bit down and need some comfort." };
    const expectedOutput = { mood: "gloomy", snackSuggestion: "chocolate chip cookies", reason: "Warm cookies are a classic comfort food." };

    mockActualPromptFunction.mockResolvedValue({ output: expectedOutput });

    const result = await textMoodToSnackFunction(input);
    expect(result).toEqual(expectedOutput);
    expect(definePromptMock).toHaveBeenCalledTimes(1);
    expect(mockActualPromptFunction).toHaveBeenCalledTimes(1);
    expect(mockActualPromptFunction).toHaveBeenCalledWith(input);
  });

  it('should call ai.definePrompt with correct definition-time args and the returned prompt with runtime input', async () => {
    const input = { moodDescription: "I'm stressed and need something crunchy." };
    const mockOutput = { mood: "stressed", snackSuggestion: "almonds", reason: "Crunchy and healthy to relieve stress." };

    mockActualPromptFunction.mockResolvedValue({ output: mockOutput });

    await textMoodToSnackFunction(input);

    expect(definePromptMock).toHaveBeenCalledTimes(1);
    expect(definePromptMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'textMoodToSnackPrompt',
        prompt: expect.any(String),
        input: expect.objectContaining({ schema: expect.anything() }),
        output: expect.objectContaining({ schema: expect.anything() })
      })
    );

    expect(mockActualPromptFunction).toHaveBeenCalledTimes(1);
    expect(mockActualPromptFunction).toHaveBeenCalledWith(input);
  });
});
