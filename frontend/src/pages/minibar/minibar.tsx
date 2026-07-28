import './minibar.css';

interface MinibarItem {
    id: number;
    code: string;
    name: string;
    unit: string;
    price: number;
}

const MinibarPage = () => {
    const minibarItems: MinibarItem[] = [
        { id: 1, code: 'FTL320', name: 'FANTA CAM LON', unit: 'Thùng', price: 50000 },
        { id: 2, code: 'SPL320', name: 'SPRITE LON', unit: 'Thùng', price: 48000 },
        { id: 3, code: 'SPC', name: 'SPRITE CHILL', unit: 'Thùng', price: 45000 },
        { id: 4, code: 'CL', name: 'COCA LON 320ML', unit: 'Thùng', price: 50000 },
        { id: 5, code: 'CLT', name: 'COCA TRẮNG LON', unit: 'Thùng', price: 48000 },
        { id: 6, code: 'ZVL', name: 'COCA ZEZO VALI 320ML', unit: 'Thùng', price: 52000 },
        { id: 7, code: 'DSNK', name: 'DASANI 500ML KHUYẾN MÃI', unit: 'Thùng', price: 35000 },
        { id: 8, code: 'TDT', name: 'TRÀ ĐÁO TỎ 450ML', unit: 'Thùng', price: 40000 },
        { id: 9, code: 'CST', name: 'TRÀ CHANH SẢ TỎ 450ML', unit: 'Thùng', price: 38000 },
        { id: 10, code: 'TVT', name: 'TRÀ VẢI TỎ 450ML', unit: 'Thùng', price: 38000 },
        { id: 11, code: 'CEL', name: 'CAM ÉP LỚN', unit: 'Thùng', price: 55000 },
        { id: 12, code: 'MTZ', name: 'MONSTER ULTRA ZERO TRẮNG', unit: 'Thùng', price: 65000 },
        { id: 13, code: 'AQR', name: 'AQUARIUS', unit: 'Thùng', price: 42000 },
        { id: 14, code: 'CPCC', name: 'CÀ PHÊ COCA (MAX COFFEE)', unit: 'Thùng', price: 60000 },
        { id: 15, code: 'DST', name: 'DASANI 1.5 LÍT (12 CHAI)', unit: 'Thùng', price: 75000 },
        { id: 16, code: 'HCC', name: 'HÀO HÀO CÓC', unit: 'Thùng', price: 32000 },
        { id: 17, code: 'HLT', name: 'HẠ LONG TRẮNG', unit: 'Thùng', price: 45000 },
        { id: 18, code: 'KMBDCV', name: 'KHUYẾN MÃI XỐ ĐÁ', unit: 'Cái', price: 85000 },
    ];

    return (
        <div className="minibar-container">
            {/* Header */}
            <div className="minibar-header">
                <h1>🍷 Minibar Anstay</h1>
                <p>Dịch vụ minibar - Đồ uống & đồ ăn nhẹ phục vụ 24/7</p>
            </div>

            {/* Menu Section */}
            <div className="menu-section">
                <h2>Thực đơn và giá tiền</h2>
                <div className="items-list">
                    {minibarItems.map((item, index) => (
                        <div key={item.id} className="item-row">
                            <div className="item-number">{index + 1}</div>
                            <div className="item-details">
                                <div className="item-code-name"><span className="item-code">{item.code}</span>
                                    <span className="item-name">{item.name}</span>
                                </div>

                            </div>
                            <div className="item-price-box">
                                <span className="item-price">
                                    {item.price.toLocaleString('vi-VN')} đ

                                </span>
                                <p className="item-unit">{item.unit}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Info */}

        </div>
    );
};

export default MinibarPage;
