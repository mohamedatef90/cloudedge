import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Renders a marketplace icon that is stored as markup, without [innerHTML].
 *
 * - `<svg …>`: drawn as a CSS mask filled with `currentColor`, so the icon keeps
 *   the text colour (and dark mode) of its container. An SVG used as a mask
 *   image is never executed, so no sanitizer bypass is needed.
 * - `<img src="https://…">`: rendered as a real <img>, only for http(s) URLs.
 * - Anything else renders nothing.
 */
@Component({
  selector: 'app-markup-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (svgMask(); as mask) {
      <span class="block h-full w-full" aria-hidden="true"
            [style.background-color]="'currentColor'"
            [style.mask]="mask" [style.-webkit-mask]="mask"></span>
    } @else if (imageSrc(); as src) {
      <img class="h-full w-full object-contain" [src]="src" [alt]="alt()" loading="lazy" />
    }
  `,
  host: { class: 'inline-block' },
})
export class MarkupIconComponent {
  markup = input<string | undefined>('');
  alt = input<string>('');

  readonly svgMask = computed(() => {
    const value = (this.markup() ?? '').trim();
    if (!/^<svg[\s>]/i.test(value)) return null;
    return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(value)}") center / contain no-repeat`;
  });

  readonly imageSrc = computed(() => {
    const value = (this.markup() ?? '').trim();
    const match = /^<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/i.exec(value);
    if (!match) return null;
    try {
      const url = new URL(match[1]);
      return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
    } catch {
      return null;
    }
  });
}
