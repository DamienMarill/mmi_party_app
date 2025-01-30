import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      // Méthode moderne avec l'API Clipboard
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      // Fallback avec execCommand
      const textArea = document.createElement('textarea');
      textArea.value = text;

      // Rendre l'élément invisible
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);

      textArea.focus();
      textArea.select();

      try {
        document.execCommand('copy');
        textArea.remove();
        return true;
      } catch (error) {
        console.error('Error copying text:', error);
        textArea.remove();
        return false;
      }
    } catch (error) {
      console.error('Error copying text:', error);
      return false;
    }
  }
}
