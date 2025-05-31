const mockActualPromptFunction = jest.fn();
const definePromptMock = jest.fn(() => mockActualPromptFunction);
const defineFlowMock = jest.fn((config, fn) => fn);

jest.mock('@/ai/genkit', () => ({
  ai: {
    definePrompt: definePromptMock,
    defineFlow: defineFlowMock,
  },
}));

describe('moodToSnack', () => {
  let moodToSnackFunction: (input: any) => Promise<any>;

  beforeEach(async () => {
    jest.resetModules();

    mockActualPromptFunction.mockClear();
    definePromptMock.mockClear();
    defineFlowMock.mockClear();

    const flowModule = await import('./mood-to-snack');
    moodToSnackFunction = flowModule.moodToSnack;
  });

  it('should suggest a snack for a joyful mood with multiple snacks available', async () => {
    const input = { mood: "joyful", availableSnacks: "apples, bananas, chips" };
    const expectedOutput = { suggestedSnack: "bananas", reason: "Bananas are a great source of energy for a joyful mood." };

    mockActualPromptFunction.mockResolvedValue({ output: expectedOutput });

    const result = await moodToSnackFunction(input);
    expect(result).toEqual(expectedOutput);
    expect(definePromptMock).toHaveBeenCalledTimes(1);
    expect(mockActualPromptFunction).toHaveBeenCalledTimes(1);
    expect(mockActualPromptFunction).toHaveBeenCalledWith(input);
  });

  it('should suggest a snack for a stressed mood with limited snacks', async () => {
    const input = { mood: "stressed", availableSnacks: "nuts, dark chocolate" };
    const expectedOutput = { suggestedSnack: "dark chocolate", reason: "Dark chocolate can help reduce stress." };

    mockActualPromptFunction.mockResolvedValue({ output: expectedOutput });

    const result = await moodToSnackFunction(input);
    expect(result).toEqual(expectedOutput);
    expect(definePromptMock).toHaveBeenCalledTimes(1);
    expect(mockActualPromptFunction).toHaveBeenCalledTimes(1);
    expect(mockActualPromptFunction).toHaveBeenCalledWith(input);
  });

  it('should call ai.definePrompt with correct definition-time args and the returned prompt with runtime input', async () => {
    const input = { mood: "curious", availableSnacks: "pretzels, berries, cheese" };
    const mockOutput = { suggestedSnack: "berries", reason: "Berries offer a delightful mix of flavors for a curious mood." };

    mockActualPromptFunction.mockResolvedValue({ output: mockOutput });

    await moodToSnackFunction(input);

    expect(definePromptMock).toHaveBeenCalledTimes(1);
    expect(definePromptMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'moodToSnackPrompt',
        prompt: expect.any(String),
        input: expect.objectContaining({ schema: expect.anything() }),
        output: expect.objectContaining({ schema: expect.anything() })
      })
    );

    expect(mockActualPromptFunction).toHaveBeenCalledTimes(1);
    expect(mockActualPromptFunction).toHaveBeenCalledWith(input);
  });
});
