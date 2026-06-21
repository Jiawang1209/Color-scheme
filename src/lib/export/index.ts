import { hexToRgb } from '../color/convert';

export type ExportFormat =
  | 'hex' | 'rgb' | 'matplotlib' | 'ggplot' | 'plotly' | 'r'
  | 'css' | 'd3' | 'tailwind' | 'matlab';

const quoted = (cs: string[]) => cs.map((c) => `"${c}"`).join(', ');

export function exportCode(fmt: ExportFormat, colors: string[], name: string): string {
  switch (fmt) {
    case 'hex':
      return `[${quoted(colors)}]`;
    case 'rgb':
      return `[${colors.map((c) => { const { r, g, b } = hexToRgb(c); return `(${r}, ${g}, ${b})`; }).join(', ')}]`;
    case 'matplotlib':
      return `from matplotlib.colors import ListedColormap\n${name} = ListedColormap([${quoted(colors)}])`;
    case 'ggplot':
      return `scale_fill_manual(values = c(${quoted(colors)}))`;
    case 'plotly':
      return `colorscale = [${quoted(colors)}]`;
    case 'r':
      return `${name} <- c(${quoted(colors)})`;
    case 'css':
      return `:root {\n${colors.map((c, i) => `  --${name}-${i + 1}: ${c};`).join('\n')}\n}`;
    case 'd3':
      return `const ${name} = [${quoted(colors)}];\n// e.g. d3.scaleOrdinal().range(${name})`;
    case 'tailwind':
      return `// tailwind.config.js → theme.extend.colors\n'${name}': {\n${colors.map((c, i) => `  ${(i + 1) * 100}: '${c}',`).join('\n')}\n}`;
    case 'matlab':
      return `${name} = [\n${colors.map((c) => { const { r, g, b } = hexToRgb(c); return `  ${(r / 255).toFixed(4)} ${(g / 255).toFixed(4)} ${(b / 255).toFixed(4)};`; }).join('\n')}\n];`;
    default:
      return `[${quoted(colors)}]`;
  }
}
