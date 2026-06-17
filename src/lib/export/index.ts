import { hexToRgb } from '../color/convert';

export type ExportFormat = 'hex' | 'rgb' | 'matplotlib' | 'ggplot' | 'plotly' | 'r';

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
  }
}
