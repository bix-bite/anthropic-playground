export default class Shared {
  static formattedNow(): string {
    const now = new Date();

    const padStart = (value: number) => value.toString().padStart(2, '0');

    return (
      `${now.getFullYear()}${padStart(now.getMonth())}${padStart(now.getDate())}_` +
      `${padStart(now.getHours())}${padStart(now.getMinutes())}${padStart(now.getSeconds())}_` +
      `${now.getMilliseconds()}`
    );
  }

  static keys = {
    STORE: 'anthropic.playground',
    OPENAI_KEY: 'openAiKey',
    ANTHROPIC_KEY: 'anthropicKey',
    OPENAI_MODEL_LIST: 'openAiModelList',
    ANTHROPIC_MODEL_LIST: 'anthropicModelList',
    OPENAI_MODEL: 'openAiModel',
    ANTHROPIC_MODEL: 'anthropicModel',
    LLM_LIST: 'LLMList',
    PREFERRED_LLM: 'PreferredLLM',
    DEFAULT_ANTHROPIC_MODEL_LIST: [
      'claude-3-5-sonnet-20240620',
      'claude-3-haiku-20240307',
      'claude-3-opus-20240229',
      'gpt-4',
    ],
    DEFAULT_OPENAI_MODEL_LIST: [
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4-turbo',
      'gpt-4',
    ]
  };
}
