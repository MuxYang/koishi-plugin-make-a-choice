import { Context, Schema } from 'koishi'

export const name = 'make-a-choice'

export interface Config {
  wakeWords: string[]
}

export const Config: Schema<Config> = Schema.object({
  wakeWords: Schema.array(Schema.string()).default(['选择', '帮选', '决定']).description('触发插件的唤醒词列表。'),
})

export function apply(ctx: Context, config: Config) {
  const wakeWords = config.wakeWords.map(word => word.trim()).filter(Boolean)
  if (!wakeWords.length) return

  ctx.middleware(async (session, next) => {
    const content = session.content?.trim()
    if (!content) return next()

    const hit = wakeWords.find(word => content.startsWith(word))
    if (!hit) return next()

    const payload = content.slice(hit.length).trim()
    if (!payload.includes('还是')) return next()

    const match = payload.match(/^(.*?)\s*还是\s*(.*)$/)
    if (!match) return next()

    const left = match[1].trim()
    const right = match[2].trim()
    if (!left || !right) return next()

    if (left === right) {
      await session.send('我不知道是谁都选好了还在问我◖⁠⚆⁠ᴥ⁠⚆⁠◗')
      return
    }

    const choice = Math.random() < 0.5 ? left : right
    await session.send(`我建议${choice}`)
  })
}
