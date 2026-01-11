import { Context, Schema } from 'koishi'

export const name = 'make-a-choice'

export interface Config {
  wakeWords: string[]
}

export const Config: Schema<Config> = Schema.object({
  wakeWords: Schema.array(Schema.string()).default(['选择', '帮选', '决定']).description('触发插件的唤醒词列表。'),
})

export function apply(ctx: Context, config: Config) {
  const wakeWords = Array.from(new Set(config.wakeWords.map(word => word.trim()).filter(Boolean)))
  if (!wakeWords.length) return

  const handleChoice = async (payload: string | undefined) => {
    const text = payload?.trim()
    if (!text) return '请按照“左边 还是 右边”的格式提供两个选项。'
    if (!text.includes('还是')) return '请用“左边 还是 右边”的格式，让我能拆分两个选项。'

    const match = text.match(/^(.*?)\s*还是\s*(.*)$/)
    if (!match) return '没有找到两个可供选择的选项。'

    const left = match[1].trim()
    const right = match[2].trim()
    if (!left || !right) return '两个选项都要提供哦。'
    if (left === right) return '我不知道是谁都选好了还在问我◖⁠⚆⁠ᴥ⁠⚆⁠◗'

    const choice = Math.random() < 0.5 ? left : right
    return `我建议${choice}`
  }

  for (const word of wakeWords) {
    ctx
      .command(`${word} <payload:text>`, '在“xx还是xx”之间随机选择')
      .shortcut(word, { prefix: true })
      .usage(`示例：${word} 可乐 还是 雪碧`)
      .example(`${word} 猫 还是 狗`)
      .action(async ({ session }, payload) => handleChoice(payload))
  }
}
