import { workspace } from 'vscode'

import { FunctionParam } from './ast'
import { __intl } from './build-resource/constant'
import { antdRushErrorMsg } from './utils'

/**
 * Fill handler template with parameters and its type
 */
export function composeHandlerString(
  fullHandlerName: string,
  params: FunctionParam[],
  indent: number,
  type: 'class' | 'functional'
) {
  const paramsText = params.map((p) => p.text).join(', ')
  // TODO: inset param types in ts
  if (type === 'class') {
    return (
      '\n\n' +
      withIndent(
        `${fullHandlerName} = (${paramsText}) => {
${' '.repeat(indent)}
}\n`,
        indent
      )
    )
  }
  if (type === 'functional') {
    return withIndent(
      '\n\n' +
        `const ${fullHandlerName} = useCallback((${paramsText}) => {\n${' '.repeat(
          indent
        )}\n}, [])\n`,
      indent
    )
  }
  throw Error(antdRushErrorMsg(`should not accept component type of ${type}`))
}

/**
 * Add indent to string at start at each line
 */
export function withIndent(raw: string, indent: number): string {
  return raw
    .split('\n')
    .map((line) => ' '.repeat(indent) + line)
    .join('\n')
}

export function addHandlerPrefix(handlerName: string): string {
  const handlerPrefix = workspace.getConfiguration().get('antdRush.handlerPrefix')
  const camelizedHandlerName = handlerName.slice(0, 1).toUpperCase() + handlerName.slice(1)
  return `${handlerPrefix}${camelizedHandlerName}`
}
