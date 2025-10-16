import { describe, it, expect, vi, beforeEach } from 'vitest';
import { printDocument, generatePDF, captureElement } from '../../utils/PrintUtils';
import { mockDocument } from '../utils/test-utils';

// Mock html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn(() => Promise.resolve({
    toDataURL: vi.fn(() => 'data:image/png;base64,mockImageData')
  }))
}));

// Mock jsPDF
vi.mock('jspdf', () => ({
  default: vi.fn(() => ({
    addImage: vi.fn(),
    save: vi.fn(),
    setProperties: vi.fn(),
    setFontSize: vi.fn(),
    text: vi.fn(),
    setTextColor: vi.fn(),
    setFont: vi.fn(),
    getNumberOfPages: vi.fn(() => 1),
    getPageWidth: vi.fn(() => 210),
    getPageHeight: vi.fn(() => 297),
    setPage: vi.fn(),
    addPage: vi.fn(),
    internal: {
      pageSize: {
        width: 210,
        height: 297
      }
    }
  }))
}));

describe('PrintUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('printDocument', () => {
    it('should print document successfully', async () => {
      const mockWindow = {
        print: vi.fn(),
        document: {
          createElement: vi.fn(() => ({
            innerHTML: '',
            style: {},
            appendChild: vi.fn(),
            remove: vi.fn()
          }))
        }
      };

      Object.defineProperty(window, 'print', {
        value: mockWindow.print,
        writable: true
      });

      await printDocument(mockDocument, 'A4', 'portrait', 1, 20);

      expect(mockWindow.print).toHaveBeenCalled();
    });

    it('should handle print errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock window.print to throw error
      Object.defineProperty(window, 'print', {
        value: vi.fn(() => { throw new Error('Print failed'); }),
        writable: true
      });

      await printDocument(mockDocument, 'A4', 'portrait', 1, 20);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('generatePDF', () => {
    it('should generate PDF successfully', async () => {
      const result = await generatePDF(mockDocument, 'A4', 'portrait', 1, 20);
      
      expect(result).toBeDefined();
    });

    it('should handle PDF generation errors', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock html2canvas to throw error
      const { default: html2canvas } = await import('html2canvas');
      vi.mocked(html2canvas).mockRejectedValueOnce(new Error('Canvas error'));

      const result = await generatePDF(mockDocument, 'A4', 'portrait', 1, 20);
      
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('captureElement', () => {
    it('should capture element successfully', async () => {
      const mockElement = document.createElement('div');
      const result = await captureElement(mockElement, 1);
      
      expect(result).toBe('data:image/png;base64,mockImageData');
    });

    it('should handle capture errors', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock html2canvas to throw error
      const { default: html2canvas } = await import('html2canvas');
      vi.mocked(html2canvas).mockRejectedValueOnce(new Error('Capture error'));

      const mockElement = document.createElement('div');
      const result = await captureElement(mockElement, 1);
      
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
