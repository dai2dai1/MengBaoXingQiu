/**
 * 超级智能语音解析器
 * 
 * 功能：
 * 1. 谐音容错 (家→加, 减→剪→见 等)
 * 2. 支持中文数字字 (五百 = 500, 一千零二十 = 1020 等)
 * 3. 模糊姓名匹配，兼容语音误识别
 */

// ─── 谐音字映射 ─────────────────────────────────────────────
const HOMOPHONE_MAP = {
  // 加的谐音
  '家': '加', '嘉': '加', '佳': '加', '价': '加', '夹': '加',
  // 减/扣的谐音
  '剪': '减', '见': '减', '建': '减', '健': '减', '戒': '减',
  '扣': '扣', '购': '扣', '够': '扣',
  // 分/积分的谐音
  '奋': '分', '份': '分', '粉': '分'
};

// ─── 中文数字解析 ─────────────────────────────────────────────
const CN_DIGIT = { '零':0,'一':1,'二':2,'两':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9 };

function parseChinese(text) {
  if (!text || !text.trim()) return 0;
  
  // Step 1: Try pure Arabic digits
  const arabicMatch = text.match(/(\d+)/);
  if (arabicMatch) return parseInt(arabicMatch[1], 10);
  
  let num = 0;
  let temp = 0; // accumulator for the current unit group

  // Step 2: Parse Chinese numeral string character by character
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (CN_DIGIT[ch] !== undefined) {
      temp = CN_DIGIT[ch];
    } else if (ch === '十' || ch === '拾') {
      // handle "十" at start meaning "10", or "二十" meaning 20
      if (temp === 0) temp = 1;
      temp *= 10;
      num += temp;
      temp = 0;
    } else if (ch === '百' || ch === '佰') {
      if (temp === 0) temp = 1;
      num += temp * 100;
      temp = 0;
    } else if (ch === '千' || ch === '仟') {
      if (temp === 0) temp = 1;
      num += temp * 1000;
      temp = 0;
    } else if (ch === '万') {
      num = (num + temp) * 10000;
      temp = 0;
    }
  }
  num += temp; // add any remaining
  return num;
}

// ─── 谐音归一化 ─────────────────────────────────────────────
function normalizeHomophones(text) {
  let normalized = '';
  for (const ch of text) {
    normalized += HOMOPHONE_MAP[ch] || ch;
  }
  return normalized;
}

// ─── 模糊姓名匹配 ─────────────────────────────────────────────
// Simple substring + pinyin-like matching via character presence
function matchChild(text, childrenData) {
  // First pass: exact substring match
  for (const child of childrenData) {
    if (text.includes(child.name)) return child;
    for (const nick of child.nicknames) {
      if (nick.trim() && text.includes(nick.trim())) return child;
    }
  }
  
  // Second pass: partial character match (for 2+ char names, match any single char)
  for (const child of childrenData) {
    const allNames = [child.name, ...child.nicknames].join('');
    for (const ch of allNames) {
      if (ch && text.includes(ch)) {
        // Only match if the character is somewhat unique (not a common word)
        const commonChars = '的了我你他她给加扣减分积和也';
        if (!commonChars.includes(ch)) {
          return child;
        }
      }
    }
  }
  
  return null;
}

// ─── 主解析函数 ──────────────────────────────────────────────
export function parseVoiceCommand(rawText, childrenData) {
  const text = normalizeHomophones(rawText);
  
  // Determine action
  let isAdd = true;
  if (text.includes('减') || text.includes('扣')) {
    isAdd = false;
  }

  // Find child
  const matchedChild = matchChild(text, childrenData);
  if (!matchedChild) {
    return { error: '未识别到对应的孩子名字，请在设置中确认已添加该孩子的小名' };
  }

  // Extract number — try Arabic digits first, then Chinese numerals
  let value = 1;
  
  // Try to find context window around action word
  // E.g., "加五百", "扣三十分", "加500积分"
  const actionPattern = /(加|减|扣)([一二两三四五六七八九十百千万\d零]+)/;
  const actionMatch = text.match(actionPattern);
  
  if (actionMatch) {
    value = parseChinese(actionMatch[2]);
  } else {
    // Try just finding any number in the whole text
    const anyNumberPattern = /([一二两三四五六七八九十百千万]{1,6}|\d+)\s*(分|积分)?/;
    const anyMatch = text.match(anyNumberPattern);
    if (anyMatch) {
      value = parseChinese(anyMatch[1]);
    }
  }

  if (!value || value <= 0) value = 1;

  // Extract reason
  let reason = '';
  const reasonMatch = text.match(/因为(.+)/);
  if (reasonMatch) {
    reason = reasonMatch[1].replace(/[。，！？.!?]+$/, '').trim();
  }
  if (!reason) reason = '语音快速录入';

  return {
    success: true,
    child: matchedChild,
    action: isAdd ? 'add' : 'deduct',
    value,
    reason,
    parsedText: text,
    originalText: rawText
  };
}
