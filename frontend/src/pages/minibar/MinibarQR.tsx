import { QRCodeSVG } from 'qrcode.react';
import './minibar-qr.css';
import { useRef } from 'react';

const MinibarQR = () => {
    const qrRef = useRef<HTMLDivElement>(null);

    // Tạo URL cho QR code - đổi thành URL Production của bạn
    const minibarUrl = `https://anstay.com.vn/minibar`;

    const downloadQR = () => {
        const svg = qrRef.current?.querySelector('svg') as SVGSVGElement;
        if (svg) {
            // Convert SVG to Canvas
            const canvas = document.createElement('canvas');
            const svgData = new XMLSerializer().serializeToString(svg);
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                canvas.getContext('2d')?.drawImage(img, 0, 0);
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = 'minibar-qr-code.png';
                link.click();
            };
            img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
        }
    };

    const printQR = () => {
        const svg = qrRef.current?.querySelector('svg') as SVGSVGElement;
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const printWindow = window.open('', '', 'height=600,width=800');
            if (printWindow) {
                printWindow.document.write(`
        <html>
          <head>
            <title>Minibar QR Code</title>
            <style>
              body { text-align: center; padding: 20px; font-family: Arial; }
              h1 { color: #333; }
              img { max-width: 500px; margin: 20px auto; }
            </style>
          </head>
          <body>
            <h1> Minibar Anstay</h1>
            <p>Quét mã QR để xem danh sách minibar</p>
            <img src="data:image/svg+xml;base64,${btoa(svgData)}" />
            <p>URL: ${minibarUrl}</p>
          </body>
        </html>
      `);
                printWindow.document.close();
                printWindow.print();
            }
        }
    };

    return (
        <div className="minibar-qr-container">
            <div className="qr-content">
                <div className="qr-header">
                    <h1> QR Code Minibar</h1>
                    <p>Quét để xem danh sách minibar</p>
                </div>

                <div className="qr-box" ref={qrRef}>
                    <QRCodeSVG
                        value={minibarUrl}
                        size={400}
                        level="H"
                        includeMargin={true}
                        bgColor="#ffffff"
                    />
                    <p className="qr-url">{minibarUrl}</p>
                </div>

                <div className="">
                    <p> Đặt mã này ở quầy lễ tân hoặc phòng để khách hàng quét và xem danh sách minibar</p>
                </div>

                <div className="action-buttons">
                    <button className="btn-download" onClick={downloadQR}>
                        ⬇ Tải ảnh QR
                    </button>
                    <button className="btn-print" onClick={printQR}>
                        In QR Code
                    </button>
                </div>

                <div className="copy-info">
                    <p>URL: <code>{minibarUrl}</code></p>
                </div>
            </div>
        </div>
    );
};

export default MinibarQR;
