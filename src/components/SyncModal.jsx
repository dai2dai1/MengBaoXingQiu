import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { Html5QrcodeScanner } from 'html5-qrcode';
import LZString from 'lz-string';
import { useAppContext } from '../store/AppContext';
import { X } from 'lucide-react';

export default function SyncModal({ onClose }) {
  const { childrenData, overwriteChildrenData } = useAppContext();
  const [mode, setMode] = useState('generate'); // 'generate' | 'scan'
  const [qrValue, setQrValue] = useState('');
  const [scanResult, setScanResult] = useState('');

  // Generate Compressed QR Code data
  useEffect(() => {
    if (mode === 'generate') {
      const jsonStr = JSON.stringify(childrenData);
      const compressed = LZString.compressToEncodedURIComponent(jsonStr);
      // add a prefix to identify our app's QR code
      setQrValue('CGAPP:' + compressed);
    }
  }, [mode, childrenData]);

  // Handle Scanner
  useEffect(() => {
    if (mode === 'scan') {
      const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: { width: 250, height: 250 } }, false);
      scanner.render(
        (decodedText) => {
          if (decodedText.startsWith('CGAPP:')) {
            scanner.clear();
            const compressedStr = decodedText.substring(6);
            try {
              const decompressed = LZString.decompressFromEncodedURIComponent(compressedStr);
              const data = JSON.parse(decompressed);
              
              if (Array.isArray(data)) {
                 if (confirm('✅ 成功识别同步数据！是否覆盖本机的全部记录？注意：这将会替换当前手机的所有资料。')) {
                    overwriteChildrenData(data);
                    alert('数据已同步更新！');
                    onClose();
                 } else {
                    setMode('generate'); // reset
                 }
              }
            } catch (e) {
              alert('二维码数据解析失败，可能已损坏: ' + e.message);
            }
          } else {
            setScanResult('无效的二维码格式！请扫描本应用的同步码。');
          }
        },
        (error) => {
          // Ignore frequent scanning errors
        }
      );

      return () => {
        scanner.clear();
      };
    }
  }, [mode]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '25px', position: 'relative', background: 'rgba(255,255,255,0.98)', borderRadius: '25px' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.05)', borderRadius: '50%', border: 'none', cursor: 'pointer', color: '#666', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={20} />
        </button>
        
        <h2 style={{ marginTop: '5px', textAlign: 'center', fontSize: '1.4rem' }}>局域网数据同步</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button 
            onClick={() => setMode('generate')}
            style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: mode === 'generate' ? 'var(--primary-color)' : '#f1f5f9', color: mode === 'generate' ? 'white' : '#64748b', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>
            生成同步码
          </button>
          <button 
            onClick={() => setMode('scan')}
            style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: mode === 'scan' ? 'var(--secondary-color)' : '#f1f5f9', color: mode === 'scan' ? 'white' : '#64748b', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>
            扫码接收
          </button>
        </div>

        {mode === 'generate' ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '15px' }}>请用另一台手机在本App中选择“扫码接收”对准此二维码</p>
            <div style={{ background: 'white', padding: '15px', display: 'inline-block', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
              {qrValue && <QRCode value={qrValue} size={200} />}
            </div>
            {qrValue.length > 2500 && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '15px', background: '#fef2f2', padding: '10px', borderRadius: '8px' }}>
                ⚠️ 您的历史记录过长，这使得图码非常密集，可能导致部分手机相机无法成功聚焦识别。如遇频繁扫码失败，建议先去主页清理久远记录后再试。
              </p>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '15px' }}>请允许网页调用摄像头权限，并对准另一台手机上的同步码</p>
            <div id="qr-reader" style={{ width: '100%', borderRadius: '15px', overflow: 'hidden', border: '2px solid transparent' }}></div>
            {scanResult && <p style={{ color: '#ef4444', marginTop: '10px' }}>{scanResult}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
