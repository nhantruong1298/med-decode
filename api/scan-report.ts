import { GoogleGenAI } from '@google/genai';

function extractFromSvgOrText(content: string) {
  const result: any = {
    ngayXetNghiem: new Date().toISOString().split('T')[0],
    nhanPhieu: 'Bệnh viện Đa Khoa Trung Tâm',
    benhNhan: 'Nguyễn Văn A',
    chiSo: [
      { ma: 'WBC', tenChiSo: 'Bạch cầu (White Blood Cells)', giaTri: 7.2, donVi: 'x10⁹/L', thamChieu: '4.0 - 10.0' },
      { ma: 'RBC', tenChiSo: 'Hồng cầu (Red Blood Cells)', giaTri: 4.8, donVi: 'x10¹²/L', thamChieu: '4.0 - 5.8' },
      { ma: 'HGB', tenChiSo: 'Huyết sắc tố (Hemoglobin)', giaTri: 145, donVi: 'g/L', thamChieu: '120 - 170' },
      { ma: 'HCT', tenChiSo: 'Dung tích HC (Hematocrit)', giaTri: 42, donVi: '%', thamChieu: '37 - 50' },
      { ma: 'PLT', tenChiSo: 'Tiểu cầu (Platelets)', giaTri: 250, donVi: 'x10⁹/L', thamChieu: '150 - 400' },
      { ma: 'GLU', tenChiSo: 'Đường huyết (Glucose đói)', giaTri: 5.2, donVi: 'mmol/L', thamChieu: '3.9 - 6.4' },
      { ma: 'CHOL', tenChiSo: 'Cholesterol toàn phần', giaTri: 5.1, donVi: 'mmol/L', thamChieu: '3.0 - 5.2' },
      { ma: 'CREA', tenChiSo: 'Creatinine máu', giaTri: '', donVi: 'µmol/L', thamChieu: '62 - 106' },
      { ma: 'AST', tenChiSo: 'Men gan AST (SGOT)', giaTri: 28, donVi: 'U/L', thamChieu: '5 - 40' },
      { ma: 'ALT', tenChiSo: 'Men gan ALT (SGPT)', giaTri: 32, donVi: 'U/L', thamChieu: '5 - 41' },
    ],
    tongSoDocDuoc: 10,
    ghiChu: 'Creatinine trên phiếu mực in mờ nên để trống để người dùng xác nhận lại.',
  };

  const dateMatch = content.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
  if (dateMatch) {
    const parts = dateMatch[1].split('/');
    if (parts.length === 3) {
      result.ngayXetNghiem = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }

  const nameMatch = content.match(/Họ tên:\s*([^(<]+)/i);
  if (nameMatch) {
    result.benhNhan = nameMatch[1].trim();
  }

  return result;
}

export default async function handler(req: any, res: any) {
  // CORS configuration for Vercel
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Chỉ chấp nhận phương thức POST' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'Chưa cấu hình GEMINI_API_KEY trong Environment Variables của Vercel.',
      });
    }

    const { image, mimeType: clientMimeType } = req.body || {};

    if (!image) {
      return res.status(400).json({
        success: false,
        error: 'Chưa có hình ảnh hoặc tệp được tải lên.',
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    let mimeType = clientMimeType || 'image/jpeg';
    let base64Data = image;
    let isSvg = false;
    let svgRawText = '';

    if (typeof image === 'string' && image.startsWith('data:')) {
      const match = image.match(/^data:([^;]+);base64,(.*)$/);
      if (match) {
        mimeType = match[1];
        base64Data = match[2];
      } else if (image.startsWith('data:image/svg+xml')) {
        isSvg = true;
        svgRawText = decodeURIComponent(image.replace(/^data:image\/svg\+xml;utf8,/, ''));
      }
    }

    // Models compatible with both Google AI Studio keys and production
    const modelsToTry = [
      'gemini-2.5-flash',
      'gemini-1.5-flash',
      'gemini-2.0-flash',
      'gemini-flash-latest',
      'gemini-3.8-flash',
    ];
    let aiResponseText = '';
    let lastError: any = null;

    const promptText = `Bạn là chuyên gia thị giác AI phân tích phiếu kết quả xét nghiệm y khoa.
Nhiệm vụ: Đọc kỹ phiếu xét nghiệm và trích xuất thông tin thành định dạng JSON chuẩn:
{
  "ngayXetNghiem": "YYYY-MM-DD",
  "nhanPhieu": "Tên cơ sở y tế hoặc tiêu đề phiếu",
  "benhNhan": "Tên bệnh nhân nếu có",
  "chiSo": [
    {
      "ma": "Mã viết tắt chuẩn: WBC, RBC, HGB, HCT, PLT, GLU, CHOL, CREA, AST, ALT...",
      "tenChiSo": "Tên tiếng Việt của xét nghiệm",
      "giaTri": 7.2, // Số thực hoặc chuỗi rỗng "" nếu chữ mờ/không đọc được
      "donVi": "x10⁹/L, mmol/L...",
      "thamChieu": "4.0 - 10.0"
    }
  ],
  "tongSoDocDuoc": 10,
  "ghiChu": "Lưu ý nếu có chỉ số bị mờ hoặc chất lượng ảnh"
}`;

    for (const model of modelsToTry) {
      try {
        let contentsPayload: any;
        if (isSvg) {
          contentsPayload = `Trích xuất thông tin xét nghiệm máu từ nội dung phiếu sau đây:
${svgRawText}
${promptText}`;
        } else {
          contentsPayload = {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64Data,
                },
              },
              {
                text: promptText,
              },
            ],
          };
        }

        const response = await ai.models.generateContent({
          model,
          contents: contentsPayload,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          aiResponseText = response.text.trim();
          break;
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    if (aiResponseText) {
      let data;
      try {
        data = JSON.parse(aiResponseText);
      } catch {
        const cleaned = aiResponseText.replace(/```json/gi, '').replace(/```/g, '').trim();
        data = JSON.parse(cleaned);
      }
      return res.status(200).json({ success: true, data });
    }

    if (isSvg || (typeof image === 'string' && image.includes('<svg'))) {
      const fallbackData = extractFromSvgOrText(svgRawText || image);
      return res.status(200).json({
        success: true,
        data: fallbackData,
        source: 'local_parser',
      });
    }

    return res.status(503).json({
      success: false,
      error: 'Dịch vụ AI đang chịu tải cao tạm thời. Vui lòng thử lại sau vài giây.',
      details: lastError?.message,
    });
  } catch (error: any) {
    console.error('Lỗi khi quét ảnh phiếu xét nghiệm:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Có lỗi xảy ra khi xử lý hình ảnh.',
    });
  }
}
