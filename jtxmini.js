let VconsoleDevDebugMode3Eaf_tEr56=0; let inputCharPositions23_fEr67=0;
let runJtxMini ;let resources = {};(function(){
  function tokenize(input) {
    let tokens = [];
    let current = "";
    let inString = false, stringChar = "";
    let inRegex = false, escaped = false;
    for (let i = 0; i < input.length; i++) {
      let ch = input[i];
      if (escaped) {
        current += ch;
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        current += ch;
        escaped = true;
        continue;
      }
      if (!inString && !inRegex && input.substr(i,2) === "//") {
        while (i < input.length && input[i] !== "\n") { i++; }
        continue;
      }
      if (!inString && !inRegex && ch === "#") {
        while (i < input.length && input[i] !== "\n") { i++; }
        continue;
      }
      if (inString) {
        current += ch;
        if (ch === stringChar) {
          inString = false;
          stringChar = "";
        }
        continue;
      }
      if (inRegex) {
        current += ch;
        if (ch === "/" && !escaped) { inRegex = false; }
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") {
        inString = true;
        stringChar = ch;
        current += ch;
        continue;
      }
      if (ch === "/") {
        let trimmed = current.trim();
        if (trimmed === "" || /[\(\=\:\,\{\[\;]$/.test(trimmed)) { inRegex = true; }
        current += ch;
        continue;
      }
if (ch === ";" ) {
  if (current.trim() !== "") { current+=";"; tokens.push(current.trim()); }
  current = "";
  continue;
}
      if ( ch === "\n") {
        if (current.trim() !== "") { tokens.push(current.trim()); }
        current = "";
        continue;
      }
      current += ch;
    }
    if (current.trim() !== "") { tokens.push(current.trim()); }
    return tokens;
  }
  function minijsToJs(input) {
    VconsoleDevDebugMode3Eaf_tEr56=0
    let tokens = tokenize(input);
    let outputLines = [];
    let declaredVariables = new Set();
    let funcCallStack = { wait: 0, fun: 0, fori:0, all:0, printf:0, ifn:0 };
    let blockStack = [];
    let waitTimes=[]
    let storageInstances = new Set(); 
    let functiondr="fun"
    let bracketStack = [];
    tokens.forEach((token,index) => {
      let line = token;
if (line === "end;") {
  let lastBlock = blockStack[blockStack.length - 1]; 
  if (!lastBlock) return;
  if (lastBlock === "wait") {
    blockStack.pop(); 
    let ms = waitTimes.shift();
    outputLines.push(`}, ${ms});`);
    return;
  }
  if (["fun", "for", "if", "elseif", "else"].includes(lastBlock)) {
    blockStack.pop(); 
    outputLines.push("}");
    return;
  }
}
if (line.endsWith("{") || line.endsWith("[")) {
  bracketStack.push(line.endsWith("{") ? "{" : "[");
}
if (line === "}" || line === "]") {
  bracketStack.pop();
}
 let waitMatch = line.match(/^wait\s+(\d+)\s*;?$/);
if (waitMatch) {
  let ms = waitMatch[1];
  waitTimes.push(ms);
  outputLines.push(`setTimeout( function() {`);
  blockStack.push("wait")
  return;
}
      if (line.startsWith(`${functiondr} `)) {
        let funcName = line.slice(functiondr.length+1).trim();
        if (funcName.endsWith(":") || funcName.endsWith(";")) {
          funcName = funcName.slice(0, -1).trim();
          outputLines.push(`function ${funcName} {`);
          blockStack.push("fun")
        }
        return;
      }
if (line.startsWith("for ")) {
  let header = line.slice(4).trim();
  if (header.endsWith(":")) {
    header = header.slice(0, -1).trim();
  }
  if (header.endsWith(";")) {
  header = header.slice(0, -1).trim();
}
  header = header.replace(/,/g, ';');
  header = header.replace(/(\w+)\.\./g, '$1.length');
  outputLines.push(`for (${header}) {`);
  blockStack.push("for")
  return;
}
let systemStorageMatch = line.match(/^\-\>\s*import\s+([a-zA-Z_]\w*)\s+"storage"\s*/);
if (systemStorageMatch) {
  let varName = systemStorageMatch[1];
  storageInstances.add(varName); 
  outputLines.push(`${varName} = createStorage();`); 
  return;
}
let systemStorageMatch2 = line.match(/^\-\>\s*import\s*\*\s*"functions"\s*/);
if (systemStorageMatch2) {
  let varName = systemStorageMatch2[1];
  functiondr="f"
  return;
}
let systemStorageMatch3 = line.match(/^\-\>\s*import\s*\*\s*"terminal"\s*/);
if (systemStorageMatch3) {
   VconsoleDevDebugMode3Eaf_tEr56=1;
  return;
}
let systemStorageMatch4 = line.match(/^\-\>\s*import\s*\*\s*"math"\s*/);
if (systemStorageMatch4) {
   Object.assign(globalThis, {
  abs: Math.abs, round: Math.round, PI: Math.PI, sin: Math.sin, cos: Math.cos,
  atan: Math.atan, tan: Math.tan, cbrt: Math.cbrt, log2: Math.log2,
  min: Math.min, max: Math.max, random: Math.random,
  minmax: (v, mi, ma) => Math.max(mi, Math.min(ma, v))
})
  return;
}
if (/^(var|let|const)\s+\w+\s*=/.test(line)) {
  throw new Error("unexpected line '"+line+"'");
    outputLines.push("var"); 
    return;
}
if (/^function\s+\w+\s*\(/.test(line)) {
  throw new Error("unexpected line '"+line+"'");
    outputLines.push("function-"); 
    return;
}
if (/setTimeout\s*\(/.test(line)) {
  throw new Error("unexpected line '"+line+"'");
    outputLines.push("setTimeout;"); 
    return;
}
      let regexIf = /^if\s+(.*)$/;
      if (regexIf.test(line)) {
        let condition = line.match(regexIf)[1];
        if (condition.endsWith(";")) { condition = condition.slice(0, -1); }
        condition = condition.replace(/!=/g, "!==");
        condition = condition.replace(/(?<![=!])=(?![=])/g, "==");
        outputLines.push(`if(${condition}){`);
        blockStack.push("if")
        return;
      }
 let regexIf2 = /^else if\s+(.*)$/;
if (regexIf2.test(line)) {
  let condition = line.match(regexIf2)[1];
  if (condition.endsWith(";")) { condition = condition.slice(0, -1); }
  condition = condition.replace(/!=/g, "!==");
  condition = condition.replace(/(?<![=!])=(?![=])/g, "==");
  blockStack.pop(); 
  outputLines.push(`} else if(${condition}){`);
 blockStack.push("elseif")
  return;
}
let regexIf3 = /^else/;
if (regexIf3.test(line)) {
  outputLines.push(`} else {`);
  return;
}
      let assignmentMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
      if (assignmentMatch) {
        let varName = assignmentMatch[1];
        let expression = assignmentMatch[2].trim();
        if (!declaredVariables.has(varName)) {
          declaredVariables.add(varName);
         line = `  ${varName}=${expression}`;
        } else {
        line = `${varName}=${expression}`;
        }
      } else {
        if (!line.endsWith(";") && !line.endsWith("{") && !line.endsWith("}")) {
          line = line + "";
        }
      }
      function replacePrintfOutsideLiterals(line,dt) {
    let result = "";
    let inString = false, stringChar = "";
    let inRegex = false, escaped = false;
    for (let i = 0; i < line.length; i++) {
      let ch = line[i];
      if (escaped) {
        result += ch;
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        result += ch;
        escaped = true;
        continue;
      }
      if (inString) {
        result += ch;
        if (ch === stringChar) { inString = false; stringChar = ""; }
        continue;
      }
      if (inRegex) {
        result += ch;
        if (ch === "/" && !escaped) { inRegex = false; }
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") {
        inString = true;
        stringChar = ch;
        result += ch;
        continue;
      }
      if (ch === "/") {
        let trimmed = result.trim();
        if (trimmed === "" || /[\(\=\:\,\{\[\;]$/.test(trimmed)) { inRegex = true; }
        result += ch;
        continue;
      }
      if (line.slice(i, i+7) === "printf(") {
        result += "console.log( ...ansiToConsoleLog(";
        funcCallStack["printf"]++;
        i += 6;
        continue;
      }
      result += ch;
    }
    return result;
  }
     line = replacePrintfOutsideLiterals(line );
      if (funcCallStack["printf"] > 0) {
  if (line.endsWith(";")) {
    line = line.slice(0, -1);
  }
  line += ")";
  funcCallStack["printf"] = 0;
}
      outputLines.push(line);
    });
    return outputLines.filter(l => l.trim() !== "").join("\n");
  }
 

processJtx = function (content) {
  const firstLine = content.split('\n')[0].trim();
  if (firstLine.startsWith('{')) {
    const parsed = JSON.parse(content);
    resources = {};
    for (const key in parsed) {
      if (key !== 'main.jtx') {
        resources[key] = parsed[key];
      }
    }
    runJtxMini(parsed['main.jtx'] || '');
  } else {
    resources = {};
    runJtxMini(content);
  }
}

runJtxMini = function (jtxcode) {
  let transpiled = minijsToJs(jtxcode);
  let newScript = document.createElement("script");
  newScript.type = "application/javascript";
  newScript.text = transpiled;
  document.body.appendChild(newScript);
};


  document.addEventListener("DOMContentLoaded", function(){
    let scripts = document.querySelectorAll('script[type="jtx"]');
    scripts.forEach(script => {
      let code = script.textContent;
      let transpiled = minijsToJs(code);
      let newScript = document.createElement("script");
      newScript.type = "application/javascript";
      newScript.text = transpiled;
      console.log(transpiled)
      document.body.appendChild(newScript);
    });
  });
})();
function createStorage(dbName = "myDB", storeName = "store") {
  const dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName);
      }
    };
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
  async function save(slot, data) {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction([storeName], "readwrite");
      const store = tx.objectStore(storeName);
      const req = store.put(data, slot);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
  function load(slot, callback) {
  dbPromise.then(db => {
    const tx = db.transaction([storeName], "readonly");
    const store = tx.objectStore(storeName);
    const req = store.get(slot);
    req.onsuccess = () => callback(req.result ?? null);
    req.onerror = () => callback(null);
  }).catch(() => callback(null));
}
  return { save, load };
}
function createscreen(id, zindex) {
  var canvas = document.createElement('canvas');
  canvas.id = id;
  let lines = [];
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = zindex;
  canvas.style.backgroundColor = 'transparent';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const originalLog = console.log;
function wrapSegmentText(segment, maxWidth, ctx) {
  const text = segment.text;
  const color = segment.color || '#eee';
  const lines = [];
  let currentLine = '';
  for (let char of text) {
    const testLine = currentLine + char;
    const testWidth = ctx.measureText(testLine).width;
    if (testWidth > maxWidth && currentLine !== '') {
      lines.push({ text: currentLine, color });
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push({ text: currentLine, color });
  }
  return lines;
}
console.log = function (...args) {
  originalLog(...args);
  if (!ctx || !canvas) return;
  const maxWidth = canvas.width - 20;
  const output = [];
  if (typeof args[0] === 'string' && args[0].includes('%c')) {
    const textParts = args[0].split('%c');
    for (let i = 0; i < textParts.length; i++) {
      const text = textParts[i];
      const style = i > 0 ? extractStyles(args[i]) : { color: '#eee' };
      if (text.trim() !== '' || i === 0) {
        output.push({ text, ...style });
      }
    }
  } else {
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
    output.push({ text: msg, color: '#eee' });
  }
  let wrappedLines = [];
  let currentLine = [];
  for (let segment of output) {
    const wrapped = wrapSegmentText(segment, maxWidth, ctx);
    for (let i = 0; i < wrapped.length; i++) {
      if (i === 0) {
        currentLine.push(wrapped[i]);
      } else {
        wrappedLines.push(currentLine);
        currentLine = [wrapped[i]];
      }
    }
  }
  if (currentLine.length) wrappedLines.push(currentLine);
  for (let line of wrappedLines) {
    lines.push(line);
  }
  enforceMaxLines();
};
console.clear = function(...args) {
  originalLog(...args);
  lines=[]
  enforceMaxLines();
};
function parseStyleString(styleString) {
      const style = {};
      styleString.split(';').forEach(part => {
        const [prop, val] = part.split(':').map(s => s && s.trim());
        if (prop && val) {
          style[prop] = val;
        }
      });
      return style;
    }
    function extractStyles(styleString) {
      const parsed = parseStyleString(styleString);
      return {
        color: parsed.color || '#eee',
        background: parsed.background || null
      };
    }
    function enforceMaxLines() {
      const maxLines = Math.floor(canvas.height/ 20);
      while (lines.length > maxLines-1) {
        lines.shift();
      }
    }
  var ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  function resizeCanvas() {
    var tempCanvas = document.createElement("canvas");
    var tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.drawImage(canvas, 0, 0);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resizeCanvas); 
let inputCharPositions = [];
function drawconsole() {
  if (VconsoleDevDebugMode3Eaf_tEr56 == 1) {
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    function redraw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '16px monospace';
      ctx.textBaseline = 'top';
      sy = 0;
      for (let i = 0; i < lines.length; i++) {
        let x = 10;
        for (const segment of lines[i]) {
          const text = segment.text;
          const width = ctx.measureText(text).width;
          const paddingY = 2;
          const lineHeight = 16 + 2 * paddingY;
          if (segment.background) {
            ctx.fillStyle = segment.background;
            ctx.fillRect(x, i * 20 + 18 - paddingY, width, lineHeight);
          }
          ctx.fillStyle = segment.color;
          ctx.fillText(text, x, i * 20 + 20);
          sy = i * 20 + 20;
          x += width;
        }
      }
    }
    redraw();
    if(input87_56){
    let inputText = input87_56.value;
    let line = '';
    let lineHeight = 20;
    let y = sy + 20;
    let maxWidth = canvas.width - 20;
    let x = 10;
    inputCharPositions = [];
    for (let i = 0; i <= inputText.length; i++) {
      let char = inputText[i] || '';
      let testLine = line + char;
      let testWidth = ctx.measureText(testLine).width;
      if (testWidth > maxWidth && line !== '') {
        ctx.fillText(line, 10, y);
        line = char;
        y += lineHeight;
        x = 10;
      } else {
        line += char;
      }
      if (i < inputText.length) {
        inputCharPositions.push({ x: x, y: y, index: i });
        x += ctx.measureText(char).width;
      }
      if (i === inputText.length) {
        inputCharPositions.push({ x: x, y: y, index: i });
      }
    }
    if (line) ctx.fillText(line, 10, y);
    let pos = input87_56.selectionStart || 0;
    if (pos <= inputCharPositions.length) {
      let caret = inputCharPositions[pos];
      if (caret) {
        ctx.fillStyle = "#ddd";
        ctx.fillRect(caret.x+1, caret.y-1, 8, lineHeight-4);
      }
    }
    inputCharPositions23_fEr67=inputCharPositions
    }
    setTimeout(drawconsole, 20); 
    return;
  }
}
if (VconsoleDevDebugMode3Eaf_tEr56 == 1) {
  drawconsole()
}
  return {
    canvas: canvas,
    ctx: ctx,
    get width() { return canvas.width; },
    get height() { return canvas.height; },
    alpha: 1.0,
    clear: function() { if (VconsoleDevDebugMode3Eaf_tEr56 == 0) { ctx.clearRect(0, 0, canvas.width, canvas.height); }},
drawbox: function(x1, y1, x2, y2, fill) {
  if (VconsoleDevDebugMode3Eaf_tEr56 == 0) {
  ctx.beginPath();
  ctx.rect(x1, y1, x2 - x1, y2 - y1);
  if (typeof fill === 'number') {
    let hex = fill.toString(16);
    hex = hex.padStart(6, '0');
    fill = '#' + hex;
  }
  if (typeof fill === 'string') {
    ctx.fillStyle = fill;
    ctx.fill();
  } else if (fill instanceof Image) {
    ctx.drawImage(fill, x1, y1, x2 - x1, y2 - y1);
  }
  ctx.closePath();
  }
},
    drawtriangle: function(x1, y1, x2, y2, x3, y3, fill) {
      if (VconsoleDevDebugMode3Eaf_tEr56 == 0) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.closePath();
 if (typeof fill === 'number') {
  let hex = fill.toString(16);
  hex = hex.padStart(6, '0');
  fill = '#' + hex;
}
      if (typeof fill === 'string') {
        ctx.fillStyle = fill;
        ctx.fill();
      } else if (fill instanceof Image) {
        var pattern = ctx.createPattern(fill, 'repeat');
        ctx.fillStyle = pattern;
        ctx.fill();
      }}
    },
 texture: function(src) {
      var img = new Image();
      img.src = src;
      return img;
 },
click: function(callback) {
  if (typeof callback === 'function') {
    this.clickHandler = (event) => {
      var x = event.offsetX;
      var y = event.offsetY;
      callback(x, y);
    };
    this.canvas.addEventListener('click', this.clickHandler);
  }
},
press: function(onPress, onRelease) {
  this.pressStartHandler = (event) => {
    var x = event.offsetX;
    var y = event.offsetY;
    onPress(x, y);  
  };
  this.pressEndHandler = (event) => {
    onRelease();  
  };
  this.canvas.addEventListener('mousedown', this.pressStartHandler);
  this.canvas.addEventListener('mouseup', this.pressEndHandler);
},
rmevent: function() {
  this.canvas.removeEventListener('click', this.clickHandler);
  this.canvas.removeEventListener('mousedown', this.pressStartHandler);
this.canvas.removeEventListener('mouseup', this.pressEndHandler);
},
pressHandler: function(event) {
  var x = event.offsetX;
  var y = event.offsetY;
  callback(x, y);
},
    scale: function(sx, sy) { if (VconsoleDevDebugMode3Eaf_tEr56 == 0) { ctx.scale(sx, sy); } },
    translate: function(tx, ty) { if (VconsoleDevDebugMode3Eaf_tEr56 == 0) {ctx.translate(tx, ty);} },
    rotate: function(angle) {if (VconsoleDevDebugMode3Eaf_tEr56 == 0) { ctx.rotate(angle); }},
    drawpointbox: function(x1, y1, x2, y2, x3, y3, x4, y4, fill, stretch3d) {
      if (VconsoleDevDebugMode3Eaf_tEr56 == 0) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.lineTo(x4, y4);
      ctx.closePath();
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
 if (typeof fill === 'number') {
  let hex = fill.toString(16);
  hex = hex.padStart(6, '0');
  fill = '#' + hex;
}
      if (typeof fill === 'string') {
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = fill;
        ctx.stroke();
      } else if (fill instanceof Image) {
        if (stretch3d) {
          ctx.save();
          var w = fill.width,
            h = fill.height;
          var a = x2 - x1;
          var b = y2 - y1;
          var c = x4 - x1;
          var d = y4 - y1;
          ctx.setTransform(a / w, b / w, c / h, d / h, x1, y1);
          ctx.drawImage(fill, 0, 0, w, h);
          ctx.restore();
        } else {
          var pattern = ctx.createPattern(fill, 'repeat');
          ctx.fillStyle = pattern;
          ctx.fill();
        }
      }}
    },
 drawtext: function(x, y, text, textSize, colorOrTexture, fontStyle) {
   if (VconsoleDevDebugMode3Eaf_tEr56 == 0) {
  ctx.font = ` normal ${textSize}px Arial`; 
  if(fontStyle){
    ctx.font = fontStyle; 
  }
  if (typeof colorOrTexture === 'number') {
  let hex = colorOrTexture.toString(16);
  hex = hex.padStart(6, '0');
  colorOrTexture = '#' + hex;
}
  if (colorOrTexture instanceof Image) {
    var pattern = ctx.createPattern(colorOrTexture, 'repeat');
    ctx.fillStyle = pattern;
  } else {
    ctx.fillStyle = colorOrTexture;
  }
  ctx.fillText(text, x, y); 
   }
},
    drawsphere: function(x, y, fill) {
      if (VconsoleDevDebugMode3Eaf_tEr56 == 0) {
      var r = 50;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.closePath();
 if (typeof fill === 'number') {
  let hex = fill.toString(16);
  hex = hex.padStart(6, '0');
  fill = '#' + hex;
}
      if (typeof fill === 'string') {
        ctx.fillStyle = fill;
        ctx.fill();
      } else if (fill instanceof Image) {
        var pattern = ctx.createPattern(fill, 'repeat');
        ctx.fillStyle = pattern;
        ctx.fill();
      }}
    },
    drawline: function(x1, y1, x2, y2, thickness, fill) {
      if (VconsoleDevDebugMode3Eaf_tEr56 == 0) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = thickness;
      ctx.lineCap = "round";
if (typeof fill === 'number') {
  let hex = fill.toString(16);
  hex = hex.padStart(6, '0');
  fill = '#' + hex;
}
      if (typeof fill === 'string') {
        ctx.strokeStyle = fill;
      } else if (fill instanceof Image) {
        var pattern = ctx.createPattern(fill, 'repeat');
        ctx.strokeStyle = pattern;
      }
      ctx.stroke(); 
      }
    },
  };
}
function audio(src) {
  var aud = new Audio(src);
  aud.loop = false;
  return {
    get time() { return aud.currentTime; },
    set time(val) { aud.currentTime = val; },
    play: function() { aud.play(); },
    stop: function() { aud.pause(); },
    remove: function() { aud.src = ""; },
    get src() { return aud.src; },
    set src(val) { aud.src = val; },
    get loop() { return aud.loop; },
    set loop(val) { aud.loop = val; }
  };
} 
function ansiToConsoleLog(text) {
   text = String(text);
  const ansiRegex = /\x1B\[([0-9;]+)m/g;
  let parts = [], styles = [], lastIndex = 0, currentStyle = "";
  function ansiColor(n) {
    return ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"][n] || "";
  }
  function ansiBrightColor(n) {
    return ["gray", "lightred", "lightgreen", "lightyellow", "lightblue", "lightmagenta", "lightcyan", "white"][n] || "";
  }
  function styleToString(styleObj) {
    let css = [];
    if (styleObj.color) css.push(`color: ${styleObj.color}`);
    if (styleObj.background) css.push(`background: ${styleObj.background}`);
    if (styleObj.fontWeight) css.push(`font-weight: ${styleObj.fontWeight}`);
    if (styleObj.fontStyle) css.push(`font-style: ${styleObj.fontStyle}`);
    if (styleObj.textDecoration) css.push(`text-decoration: ${styleObj.textDecoration}`);
    return css.join("; ");
  }
function parseStyleString(styleStr) {
  const styleObj = {};
  styleStr.split(";").forEach(part => {
    const [key, val] = part.split(":").map(s => s.trim());
    if (key && val) {
      if (key === "color") styleObj.color = val;
      else if (key === "background") styleObj.background = val;
      else if (key === "font-weight") styleObj.fontWeight = val;
      else if (key === "font-style") styleObj.fontStyle = val;
      else if (key === "text-decoration") styleObj.textDecoration = val;
    }
  });
  return styleObj;
}
  let match;
  let va=text
  while ((match = ansiRegex.exec(text)) !== null) {
    const codes = match[1].split(";").map(Number);
    const start = match.index;
    if (start > lastIndex) {
      parts.push("%c" + text.substring(lastIndex, start));
      styles.push(currentStyle);
    }
    let tempStyle = {};
    let i = 0;
    while (i < codes.length) {
      let code = codes[i];
      if (code === 0) {  tempStyle = {};currentStyle = ""; }
      else if (code >= 30 && code <= 37) tempStyle.color = ansiColor(code - 30);
      else if (code >= 40 && code <= 47) tempStyle.background = ansiColor(code - 40);
      else if (code >= 90 && code <= 97) tempStyle.color = ansiBrightColor(code - 90);
      else if (code >= 100 && code <= 107) tempStyle.background = ansiBrightColor(code - 100);
      else if (code === 38 && codes[i+1] === 2) {
        let [r, g, b] = codes.slice(i+2, i+5);
        tempStyle.color = `rgb(${r},${g},${b})`;
        i += 4;
      }
      else if (code === 48 && codes[i+1] === 2) {
        let [r, g, b] = codes.slice(i+2, i+5);
        tempStyle.background = `rgb(${r},${g},${b})`;
        i += 4;
      }
      else if (code === 1) tempStyle.fontWeight = "bold";
      else if (code === 3) tempStyle.fontStyle = "italic";
      else if (code === 4) tempStyle.textDecoration = "underline";
      i++;
    }
    const mergedStyleObj = Object.assign({}, parseStyleString(currentStyle), tempStyle);
currentStyle = styleToString(mergedStyleObj);
    lastIndex = ansiRegex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push("%c" + text.substring(lastIndex));
    styles.push(currentStyle);
  }
  return [parts.join(""), ...styles];
}
function CSS(selector, styles) {
  document.querySelectorAll(selector).forEach(function(el) {
    el.style.cssText = styles;
  });
}
function getPoint() {
  let point = { x: null, y: null, button: null };
  function updateFromMouse(e) {
    if (e.buttons === 1 || e.type === "mousedown") {
      point.x = e.clientX;
      point.y = e.clientY;
      point.button = "left";
    } else {
      point.x = null;
      point.y = null;
      point.button = null;
    }
  }
  function updateFromTouch(e) {
    if (e.touches.length > 0) {
      point.x = e.touches[0].clientX;
      point.y = e.touches[0].clientY;
      point.button = null;
    } else {
      point.x = null;
      point.y = null;
      point.button = null;
    }
  }
  window.addEventListener("mousedown", updateFromMouse);
  window.addEventListener("mouseup", updateFromMouse);
  window.addEventListener("mousemove", updateFromMouse);
  window.addEventListener("touchstart", updateFromTouch, { passive: true });
  window.addEventListener("touchend", updateFromTouch, { passive: true });
  window.addEventListener("touchmove", updateFromTouch, { passive: true });
  return () => ({ ...point });
}
function randint(min, max, step = 0.1) {
  const range = Math.floor((max - min) / step) + 1;
  const randomStep = Math.floor(Math.random() * range);
  return min + randomStep * step;
}
function minmax(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function calculateangle(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1);
}
let input87_56 = null;
function InputFile(callback, value) {
  input87_56 = document.createElement("input");
  input87_56.type = "file";
  input87_56.style.position = "fixed";
  input87_56.style.top = "50%";
  input87_56.style.left = "50%";
  input87_56.style.transform = "translate(-50%, -50%)";
  input87_56.style.width = "100vw";
  input87_56.style.opacity = "0";
  input87_56.value = value || "";
  input87_56.style.fontSize = "20px";
  input87_56.style.height = "100vh";
  input87_56.style.zIndex = "0";
  input87_56.autofocus = true;
  document.body.appendChild(input87_56);
  const cleanup = () => {
    window.removeEventListener("click", onClickFocus);
    document.body.removeChild(input87_56);
    input87_56 = null;
  };
  const onClickFocus = () => {
    input87_56.click();
    input87_56.onchange = () => {
      const file = input87_56.files[0];
      if (!file) {
        cleanup();
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result;
        cleanup();
        callback(text, file.name);
      };
      reader.readAsText(file);
    };
  };
  window.addEventListener("click", onClickFocus);
}
function InputFileBase64(callback) {
  const input = document.createElement("input");
  input.type = "file";
  input.style.position = "fixed";
  input.style.top = "50%";
  input.style.left = "50%";
  input.style.transform = "translate(-50%, -50%)";
  input.style.width = "100vw";
  input.style.opacity = "0";
  input.style.fontSize = "20px";
  input.style.height = "100vh";
  input.style.zIndex = "0";
  input.autofocus = true;
  document.body.appendChild(input);
  const cleanup = () => {
    window.removeEventListener("click", onClickFocus);
    document.body.removeChild(input);
  };
  const onClickFocus = () => {
    input.click();
    input.onchange = () => {
      const file = input.files[0];
      if (!file) {
        cleanup();
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        cleanup();
        callback(base64, file.name);
      };
      reader.readAsDataURL(file);
    };
  };

  window.addEventListener("click", onClickFocus);
}

 


function DownloadText(text, filename) {
  if (location.href.startsWith("file:///")) {
    NativeJava.DownloadText(text, filename);
  } else {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

function Input(type, callback, value) {
  input87_56 = document.createElement("input");
  input87_56.type = "text";
  input87_56.style.position = "fixed";
  input87_56.style.top = "50%";
  input87_56.style.left = "50%";
  input87_56.style.transform = "translate(-50%, -50%)";
  input87_56.style.width="100vw"
  input87_56.style.opacity="0"
   input87_56.value=value||""
  input87_56.style.fontSize = "20px";
  input87_56.style.height="100vh"
  input87_56.style.zIndex="0"
  input87_56.autofocus = true;
  document.body.appendChild(input87_56);
  input87_56.focus();

const onClickFocus = (e) => {
  if(VconsoleDevDebugMode3Eaf_tEr56==1){
  setCaretByCoords(e.clientX - 0, e.clientY - 0);
  }
  e.preventDefault();
  input87_56.focus();
};
lastvalue=""
window.addEventListener("click", onClickFocus);
const cleanup = () => {
  window.removeEventListener("click", onClickFocus);
  document.body.removeChild(input87_56);
  input87_56 = null;
};
  if (type === "enter") {
    input87_56.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        lastvalue=input87_56.value
        cleanup();
        callback(lastvalue);
      }
    });
  }
  if (type === "input") {
    input87_56.addEventListener("input", () => {
      lastvalue=input87_56.value
      cleanup();
      callback(lastvalue);
    });
  }
  const submit = () => {
    lastvalue=input87_56.value
    cleanup();
    callback(lastvalue);
  };
  if (type === "submit") {
  }
    const api = {
    submit,
    get writepos() {
      return input87_56.selectionStart;
    },
    set writepos(pos) {
      const length = input87_56.value.length;
      const clamped = Math.max(0, Math.min(pos, length));
      input87_56.setSelectionRange(clamped, clamped);
    }
  };
  return api;
}
function clrscr() {
  console.clear();
}
const setCaretByCoords = (x, y) => {
  let closest = 0;
  let minDist = Infinity;
  for (let i = 0; i < inputCharPositions23_fEr67.length; i++) {
    const pos = inputCharPositions23_fEr67[i];
    const dx = pos.x - x;
    const dy = pos.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < minDist) {
      minDist = dist;
      closest = pos.index;
    }
  }
  input87_56.setSelectionRange(closest, closest);
};
function insertSorted(a, o) {var lo = 0, hi = a.length;while (lo < hi) {var mid = (lo + hi) >> 1;if (a[mid].z > o.z) hi = mid; else lo = mid + 1;}a.splice(lo, 0, o);} function mergeSortedArrays(arr) {var indices = new Array(arr.length).fill(0), merged = []; while (true) { var minIdx = -1, minZ = Infinity;for (var i = 0; i < arr.length; i++) {if (indices[i] < arr[i].length) {var z = arr[i][indices[i]].z;if (z < minZ) { minZ = z; minIdx = i; }}}if (minIdx === -1) break;merged.push(arr[minIdx][indices[minIdx]++]);}return merged; } function jtxEngine() {var engine = {};
engine.canvas = null;engine.ctx = null;engine.maps = [];engine.textures = {};engine.scrollX = 0;engine.scrollY = 0;engine.zoom = 1;engine.Canvas = function(selector) {engine.canvas = document.querySelector(selector);engine.ctx = engine.canvas.getContext("2d");engine.ctx.imageSmoothingEnabled = false;engine.ctx.mozImageSmoothingEnabled = false;engine.ctx.webkitImageSmoothingEnabled = false;engine.ctx.msImageSmoothingEnabled = false;return engine.canvas;};engine.setCanvas = function(canvasElement) {engine.canvas = canvasElement;engine.ctx = engine.canvas.getContext("2d");engine.ctx.imageSmoothingEnabled = false;engine.ctx.mozImageSmoothingEnabled = false;engine.ctx.webkitImageSmoothingEnabled = false;engine.ctx.msImageSmoothingEnabled = false;return engine.canvas;};
engine.Textures = function(textureDict, resource ) {var count = Object.keys(textureDict).length, loaded = 0;for (var key in textureDict) { if (textureDict.hasOwnProperty(key)) {var img = new Image();if(resource){img.src ="data:image/png;base64,"+ resource[textureDict[key]];  }else{img.src = textureDict[key];} img.onload = function() { loaded++; if (loaded === count) engine.render(); };engine.textures[key] = img; }}};engine.Map = function() {var map = {};map.offscreen = { w: 0, h: 0 };map.scrollX=0; map.scrollY=0;map.zlayer = 0;map.objs = [];map.grid = {};map.cellSize = 64;map.type = "static";map.OBJ = function(obj) { obj.data = obj.data || {}; map.objs.push(obj); if (map.type === "static") {var cellX = Math.floor(obj.x / map.cellSize);var cellY = Math.floor(obj.y / map.cellSize);var key = cellX + "_" + cellY;if (!map.grid[key]) map.grid[key] = [];insertSorted(map.grid[key], obj); }};function rebuildGrid() { map.grid = {}; for (var i = 0; i < map.objs.length; i++) {var obj = map.objs[i];var cellX = Math.floor(obj.x / map.cellSize);var cellY = Math.floor(obj.y / map.cellSize);var key = cellX + "_" + cellY;if (!map.grid[key]) map.grid[key] = [];insertSorted(map.grid[key], obj); }}function hasName(nested, searchName) { if (searchName === "") return true; if (Array.isArray(nested)) return nested.indexOf(searchName) !== -1; if (typeof nested === "object" && nested !== null) {for (var key in nested) {if (key === searchName) return true;if (hasName(nested[key], searchName)) return true;} } return false;}map.EditOBJS = function(searchName, params) { for (var i = 0; i < map.objs.length; i++) {var obj = map.objs[i];if (obj.name && hasName(obj.name, searchName)) {for (var key in params) { if (params.hasOwnProperty(key)) {if (key.indexOf("add") === 0) {var base = key.slice(3);base = base.toLowerCase() === "rotation" ? "r" : base.toLowerCase();obj[base] = (obj[base] || 0) + params[key];} else {obj[key] = key === "rotation" ? params[key] : params[key];} }}} } if (map.type === "static") rebuildGrid();};map.editVisibleOBJS = function(searchName, params) { if (map.type !== "static") return; var viewX = engine.scrollX, viewY = engine.scrollY,viewW = engine.canvas.width / engine.zoom, viewH = engine.canvas.height / engine.zoom,marginW = map.offscreen ? map.offscreen.w : 0, marginH = map.offscreen ? map.offscreen.h : 0,extendedX = viewX - marginW, extendedY = viewY - marginH,extendedW = viewW + 2 * marginW, extendedH = viewH + 2 * marginH,cs = map.cellSize,minCellX = Math.floor(extendedX / cs),maxCellX = Math.floor((extendedX + extendedW) / cs),minCellY = Math.floor(extendedY / cs),maxCellY = Math.floor((extendedY + extendedH) / cs),cellArrays = []; for (var cx = minCellX; cx <= maxCellX; cx++) {for (var cy = minCellY; cy <= maxCellY; cy++) {var key = cx + "_" + cy;
if (map.grid[key]) cellArrays.push(map.grid[key]);} } var visibleObjs = mergeSortedArrays(cellArrays); for (var i = 0; i < visibleObjs.length; i++) {var obj = visibleObjs[i];if (obj.name && hasName(obj.name, searchName)) {for (var key in params) { if (params.hasOwnProperty(key)) {if (key.indexOf("add") === 0) {var base = key.slice(3);base = base.toLowerCase() === "rotation" ? "r" : base.toLowerCase();obj[base] = (obj[base] || 0) + params[key];} else {obj[key] = key === "rotation" ? params[key] : params[key];} }}} } rebuildGrid();};map.RmOBJS = function(searchName) { var newObjs = []; for (var i = 0; i < map.objs.length; i++) {var obj = map.objs[i];if (obj.name && hasName(obj.name, searchName)) continue;newObjs.push(obj); } map.objs = newObjs; if (map.type === "static") rebuildGrid();};
map.getOBJSatPosition = function(x, y) {
  var cellX = Math.floor(x / map.cellSize);
  var cellY = Math.floor(y / map.cellSize);
  var key = cellX + "_" + cellY;
  if (!map.grid[key]) return [];
  var objsAtCell = map.grid[key], wynik = [];  for (var i = 0; i < objsAtCell.length; i++) {var obj = objsAtCell[i];if (typeof obj.w !== 'undefined' && typeof obj.h !== 'undefined') {if (x >= obj.x && x <= obj.x + obj.w && y >= obj.y && y <= obj.y + obj.h) {wynik.push(obj);}} else {if (obj.x === x && obj.y === y) {wynik.push(obj);} }}
  return wynik;
};
map.removeOBJ = function(obj) {let index = map.objs.indexOf(obj);
if (index !== -1) {map.objs[index] = map.objs[map.objs.length - 1]; map.objs.pop(); }if (map.type === "static") {
let cellX = Math.floor(obj.x / map.cellSize);let cellY = Math.floor(obj.y / map.cellSize);let key = cellX + "_" + cellY;
if (map.grid[key]) {
let gridIndex = map.grid[key].indexOf(obj);
if (gridIndex !== -1) {
map.grid[key].splice(gridIndex, 1); }}}};
map.ScrollBy = function(x, y) { map.scrollX += x; map.scrollY += y; };map.SetScroll = function(x, y) { map.scrollX = x; map.scrollY = y; }
map.updateObjectPosition = function(obj) {
  if (!obj) return;var newCellX = Math.floor(obj.x / map.cellSize);var newCellY = Math.floor(obj.y / map.cellSize);var newCellKey = newCellX + "_" + newCellY;
  if (!obj._cell) {obj._cell = newCellKey; return;} if (obj._cell === newCellKey) return; var oldCellKey = obj._cell;if (map.grid[oldCellKey]) {var index = map.grid[oldCellKey].indexOf(obj);if (index !== -1) {map.grid[oldCellKey].splice(index, 1); }  } if (!map.grid[newCellKey]) map.grid[newCellKey] = [];insertSorted(map.grid[newCellKey], obj);
  obj._cell = newCellKey;};map.GetOBJS = function(searchName) { var results = []; for (var i = 0; i < map.objs.length; i++) {var obj = map.objs[i];if (obj.name && hasName(obj.name, searchName)) results.push(obj); } return results;};map.getAllOBJS = map.GetOBJS; 
    map.getVisibleOBJS = function(searchName, screen = {w: engine.canvas.width, h: engine.canvas.height}, customX = engine.scrollX, customY = engine.scrollY) {if (map.type !== "static") return map.objs;var viewX = customX ,viewY = customY , viewW = screen.w / engine.zoom,viewH = screen.h / engine.zoom,marginW = map.offscreen ? map.offscreen.w : 0,marginH = map.offscreen ? map.offscreen.h : 0,extendedX = viewX - marginW,extendedY = viewY - marginH,extendedW = viewW + 2 * marginW,extendedH = viewH + 2 * marginH,cs = map.cellSize,minCellX = Math.floor(extendedX / cs),maxCellX = Math.floor((extendedX + extendedW) / cs),minCellY = Math.floor(extendedY / cs),
      maxCellY = Math.floor((extendedY + extendedH) / cs);var visibleObjs = [];for (var cx = minCellX; cx <= maxCellX; cx++) {for (var cy = minCellY; cy <= maxCellY; cy++) {var key = cx + "_" + cy;if (map.grid[key]) {for (var obj of map.grid[key]) {if (obj.x + obj.w > extendedX && obj.x < extendedX + extendedW &&obj.y + obj.h > extendedY && obj.y < extendedY + extendedH) {if (obj.name && hasName(obj.name, searchName)) {visibleObjs.push(obj); } } } } } }return visibleObjs;
  }
return map;}; 
engine.Background = function(textureSrc, options) {
  if (!engine.textures[textureSrc]) {
    var img = new Image();
    img.src = textureSrc;
    engine.textures[textureSrc] = img;
  }
  if (options.infinite === true) {
    if (typeof options.x === "undefined") options.x = null;
    if (typeof options.y === "undefined") options.y = null;
  } else {
    options.x = (typeof options.x !== "undefined") ? options.x : 0;
    options.y = (typeof options.y !== "undefined") ? options.y : 0;
  }
  var bg = {
    texture: textureSrc,
    options: options,
    stopFlags: { w: false, h: false },
    fixedScroll: { w: null, h: null },
    render: function(ctx, tileX, tileY) {
      var img = engine.textures[textureSrc];
      if (!img || !img.complete) return;
      var w = (typeof options.width === "string" && options.width.indexOf("%") !== -1) ? engine.canvas.width : options.width;
      var h = (typeof options.height === "string" && options.height.indexOf("%") !== -1) ? engine.canvas.height : options.height;
      var scrollX = options.xy.x,
        scrollY = options.xy.y;
      var camFactorX = (Math.abs(options.camerafollowX) || 1);
      var camFactorY = (Math.abs(options.camerafollowY) || 1);
      var effectiveScrollX = ((bg.stopFlags.w ? bg.fixedScroll.w : scrollX) + options.x) * camFactorX;
      var effectiveScrollY = ((bg.stopFlags.h ? bg.fixedScroll.h : scrollY) + options.y) * camFactorY;
      ctx.drawImage(img, tileX - effectiveScrollX, tileY - effectiveScrollY, w + 1, h + 1);
    },
    stop: function(axis) {
      if (axis === "w" && !bg.stopFlags.w) {
        bg.fixedScroll.w = engine.scrollX;
        bg.stopFlags.w = true;
      }
      if (axis === "h" && !bg.stopFlags.h) {
        bg.fixedScroll.h = engine.scrollY;
        bg.stopFlags.h = true;
      }
      return bg;
    },
    continue: function(axis) {
      if (axis === "w") {
        bg.stopFlags.w = false;
        bg.fixedScroll.w = null;
      }
      if (axis === "h") {
        bg.stopFlags.h = false;
        bg.fixedScroll.h = null;
      }
      return bg;
    },
    remove: function() { bg.removed = true; }
  };
  return bg;
};
engine.drawBg = function(ctx,thisbg){
  if (thisbg) {ctx.save();thisbg.forEach(function(bg) {if (!bg || !bg.render || bg.removed) return;ctx.save();if (bg.options.bgrepeat) {
    var bgWidth = bg.options.width || engine.canvas.width;var bgHeight = bg.options.height || engine.canvas.height;
     if(bg.stopFlags.w || bg.stopFlags.h){
    var effectiveScrollX = (bg.stopFlags.w ? bg.fixedScroll.w : bg.options.xy.x/engine.zoom) + bg.options.x;
    var effectiveScrollY = (bg.stopFlags.h ? bg.fixedScroll.h : bg.options.xy.y/engine.zoom) + bg.options.y;
     }else {
       var effectiveScrollX = (bg.options.infinite && bg.options.x === null) ? 0 : Math.floor(bg.options.xy.x + bg.options.x) * (Math.abs(bg.options.camerafollowX) || 1);var effectiveScrollY = (bg.options.infinite && bg.options.y === null) ? 0 : Math.floor(bg.options.xy.y + bg.options.y) * (Math.abs(bg.options.camerafollowY) || 1);
     }
var startX = bg.options.infinite ? 0 : effectiveScrollX - (effectiveScrollX % bgWidth) - engine.canvas.width;var startY = bg.options.infinite ? 0 : effectiveScrollY - (effectiveScrollY % bgHeight) - engine.canvas.height;var endX = bg.options.infinite ? engine.canvas.width : effectiveScrollX + (engine.canvas.width + 100 )/ engine.zoom;
var endY = bg.options.infinite ? engine.canvas.height : effectiveScrollY + (engine.canvas.height + 100 )/ engine.zoom;for (var x = startX; x < endX; x += bgWidth) {for (var y = startY; y < endY; y += bgHeight) {
if(bg.options.infinite && bg.options.x === null && bg.options.y === null) {bg.render(ctx, x, y);
} else {bg.render(ctx, x, y );}}}} else {bg.render(ctx, 0, 0);} ctx.restore();});ctx.restore();}
}
engine.SetRenderer = function(maps) {engine.maps = maps;engine.render();};
engine.render = function() {if (!engine.canvas || !engine.ctx) return;if (typeof engine.renderScriptBefore === "function") {engine.renderScriptBefore(ctx);}var ctx = engine.ctx;ctx.imageSmoothingEnabled = false;ctx.mozImageSmoothingEnabled = false;ctx.webkitImageSmoothingEnabled = false;ctx.msImageSmoothingEnabled = false;
  ctx.save();ctx.scale(engine.zoom, engine.zoom);ctx.clearRect(0, 0, engine.canvas.width / engine.zoom, engine.canvas.height / engine.zoom);
  engine.drawBg(ctx,this.bgs)
engine.maps.sort(function(a, b) { return a.zlayer - b.zlayer; });for (var m = 0; m < engine.maps.length; m++) {
var map = engine.maps[m],vx = engine.scrollX-map.scrollX, vy = engine.scrollY-map.scrollX,vw = engine.canvas.width / engine.zoom, vh = engine.canvas.height / engine.zoom,mw = map.offscreen ? map.offscreen.w : 0, mh = map.offscreen ? map.offscreen.h : 0,ex = vx - mw, ey = vy - mh, ew = vw + 2 * mw, eh = vh + 2 * mh;if (map.type === "static") {var cs = map.cellSize, mcx = Math.floor(ex / cs), MCX = Math.floor((ex + ew) / cs),mcy = Math.floor(ey / cs), MCY = Math.floor((ey + eh) / cs), cells = [];
for (var cx = mcx; cx <= MCX; cx++) {for (var cy = mcy; cy <= MCY; cy++) {
var key = cx + "_" + cy;if (map.grid[key]) cells.push(map.grid[key]);}}var vis = mergeSortedArrays(cells);for (var i = 0; i < vis.length; i++) {var o = vis[i];if (o.x + o.w < ex || o.x > ex + ew || o.y + o.h < ey || o.y > ey + eh) continue;ctx.save();ctx.globalAlpha = (o.alpha !== undefined ? o.alpha : 1);var cxPos = o.x + o.w / 2 - vx, cyPos = o.y + o.h / 2 - vy;ctx.translate(cxPos, cyPos);ctx.rotate(o.r || 0);var img = engine.textures[o.t];
if (img && img.complete) ctx.drawImage(img, -o.w / 2, -o.h / 2, o.w+1, o.h+1);
else { ctx.fillStyle = "red"; ctx.fillRect(-o.w / 2, -o.h / 2, o.w, o.h); }ctx.restore();}} else {
for (var i = 0; i < map.objs.length; i++) {
var o = map.objs[i];ctx.save();ctx.globalAlpha = (o.alpha !== undefined ? o.alpha : 1);var cxPos = o.x + o.w / 2 - vx, cyPos = o.y + o.h / 2 - vy;ctx.translate(cxPos, cyPos);ctx.rotate(o.r || 0);var img = engine.textures[o.t];
if (img && img.complete) ctx.drawImage(img, -o.w / 2, -o.h / 2, o.w+1, o.h+1);
else { ctx.fillStyle = "red"; ctx.fillRect(-o.w / 2, -o.h / 2, o.w, o.h); }ctx.restore();}}}ctx.restore();
engine.drawBg(ctx,this.bgs2)
if (typeof engine.renderScriptAfter === "function") {engine.renderScriptAfter(ctx);}};
engine.ScrollBy = function(x, y) { engine.scrollX += x; engine.scrollY += y; };engine.SetScroll = function(x, y) { engine.scrollX = x; engine.scrollY = y; };engine.UpdateRenderer = function() { engine.render(); };engine.Zoom = function(scale) { engine.zoom = scale; };
engine.OBJSclick = function(cb, nozoom,custom) {engine.canvas.addEventListener("click", function(e) { var r = engine.canvas.getBoundingClientRect(),
x = (e.clientX - r.left) / engine.zoom + engine.scrollX;
y = (e.clientY - r.top) / engine.zoom + engine.scrollY;
if(nozoom){x = (e.clientX - r.left) + engine.scrollX,
  y = (e.clientY - r.top)  + engine.scrollY;}
  if(custom){
x = (e.clientX/ custom - r.left)  + engine.scrollX;
y = (e.clientY/ custom - r.top) + engine.scrollY;
  }
engine.maps.forEach(function(map) { var objs = (map.type === "static") ? map.getVisibleOBJS("") : map.objs;objs.forEach(function(o) {if (x >= o.x && x <= o.x + o.w && y >= o.y && y <= o.y + o.h) cb(o);}); });});};
engine.renderBg = function(layers) {engine.bgs=layers; engine.render()};engine.renderBgAbove = function(layers) {engine.bgs2=layers; engine.render()};
engine.OBJSpress = function(cb) {engine.canvas.addEventListener("mousedown", function(e) { var r = engine.canvas.getBoundingClientRect(),x = (e.clientX/ engine.zoom  - r.left) +engine.scrollX,y = (e.clientY/ engine.zoom  - r.top)+ engine.scrollY; engine.maps.forEach(function(map) {var objs = (map.type === "static") ? map.getVisibleOBJS("") : map.objs;objs.forEach(function(o) {if (x >= o.x && x <= o.x + o.w && y >= o.y && y <= o.y + o.h) cb(o);}); });});};return engine; } function collides(a, b) {return !(a.x + a.w <= b.x || a.x >= b.x + b.w || a.y + a.h <= b.y || a.y >= b.y + b.h); } const PI = Math.PI; const TWO_PI = 2 * PI; function mod(x, m) {while (x < 0) x += m;while (x >= m) x -= m;return x; } function sin(x) {x = mod(x, TWO_PI);const x2 = x * x;return x - (x2 * x) / 6 + (x2 * x2 * x) / 120 - (x2 * x2 * x2 * x) / 5040; } function cos(x) {x = mod(x, TWO_PI);const x2 = x * x;return 1 - x2 / 2 + (x2 * x2) / 24 - (x2 * x2 * x2) / 720; } function tan(x) {return sin(x) / cos(x); } function abs(x) {return x < 0 ? -x : x; } function atan(x) {let absX = abs(x);if (absX > 1) {return (x < 0 ? -PI/2 : PI/2) - atan(1/absX);}return (PI / 4) * x - x * (absX - 1) * (0.2447 + 0.0663 * absX); } function atan2(y, x) {if (x === 0) {if (y > 0) return PI / 2;if (y < 0) return -PI / 2;return 0;}let angle = atan(y / x);if (x > 0) return angle;return y >= 0 ? angle + PI : angle - PI; } function angleBetween(x1, y1, x2, y2) {return atan2(y2 - y1, x2 - x1); }
function getscreem(id) {
  var canvas = document.getElementById(id);var ctx = canvas.getContext('2d');ctx.imageSmoothingEnabled = true;  function resizeCanvas() {
    var tempCanvas = document.createElement("canvas");var tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = canvas.width;tempCanvas.height = canvas.height;tempCtx.drawImage(canvas, 0, 0);canvas.width = window.innerWidth;canvas.height = window.innerHeight;ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, canvas.width, canvas.height);
  }window.addEventListener('resize', resizeCanvas);
  return {
    canvas: canvas,ctx: ctx,get width() { return canvas.width; },get height() { return canvas.height; },alpha: 1.0,clear: function() { ctx.clearRect(0, 0, canvas.width, canvas.height); },drawbox: function(x1, y1, x2, y2, fill) {
ctx.beginPath();ctx.rect(x1, y1, x2 - x1, y2 - y1);if (typeof fill === 'number') {let hex = fill.toString(16);hex = hex.padStart(6, '0');fill = '#' + hex;}if (typeof fill === 'string') {ctx.fillStyle = fill;
ctx.fill();} else if (fill instanceof Image) {ctx.drawImage(fill, x1, y1, x2 - x1, y2 - y1);}ctx.closePath();},drawtriangle: function(x1, y1, x2, y2, x3, y3, fill) {ctx.beginPath();ctx.moveTo(x1, y1);ctx.lineTo(x2, y2);ctx.lineTo(x3, y3);ctx.closePath();if (typeof fill === 'number') {let hex = fill.toString(16);hex = hex.padStart(6, '0');fill = '#' + hex;
}if (typeof fill === 'string') {
ctx.fillStyle = fill;ctx.fill();} else if (fill instanceof Image) {var pattern = ctx.createPattern(fill, 'repeat');ctx.fillStyle = pattern;ctx.fill();}},texture: function(src) {var img = new Image();img.src = src;return img;},
click: function(callback) {if (typeof callback === 'function') {this.clickHandler = (event) => {var x = event.offsetX;var y = event.offsetY;callback(x, y);};this.canvas.addEventListener('click', this.clickHandler);}},press: function(onPress, onRelease) {this.pressStartHandler = (event) => {var x = event.offsetX;var y = event.offsetY;
onPress(x, y);};this.pressEndHandler = (event) => {onRelease();};this.canvas.addEventListener('mousedown', this.pressStartHandler);this.canvas.addEventListener('mouseup', this.pressEndHandler);
},rmevent: function() {this.canvas.removeEventListener('click', this.clickHandler);this.canvas.removeEventListener('mousedown', this.pressStartHandler);this.canvas.removeEventListener('mouseup', this.pressEndHandler);},pressHandler: function(event) {var x = event.offsetX;var y = event.offsetY;callback(x, y);},scale: function(sx, sy) { ctx.scale(sx, sy); },translate: function(tx, ty) { ctx.translate(tx, ty); },rotate: function(angle) { ctx.rotate(angle); },
drawpointbox: function(x1, y1, x2, y2, x3, y3, x4, y4, fill, stretch3d) {ctx.beginPath();ctx.moveTo(x1, y1);ctx.lineTo(x2, y2);ctx.lineTo(x3, y3);ctx.lineTo(x4, y4);ctx.closePath();ctx.lineJoin = "round";ctx.lineCap = "round";
if (typeof fill === 'number') {let hex = fill.toString(16);hex = hex.padStart(6, '0');fill = '#' + hex;}
if (typeof fill === 'string') {ctx.fillStyle = fill;ctx.fill();ctx.strokeStyle = fill;ctx.stroke();} else if (fill instanceof Image) {if (stretch3d) {
ctx.save();var w = fill.width,h = fill.height;
var a = x2 - x1;var b = y2 - y1;var c = x4 - x1;var d = y4 - y1;ctx.setTransform(a / w, b / w, c / h, d / h, x1, y1);ctx.drawImage(fill, 0, 0, w, h);ctx.restore();} else {var pattern = ctx.createPattern(fill, 'repeat');ctx.fillStyle = pattern;ctx.fill();}}},drawtext: function(x, y, text, textSize, colorOrTexture, fontStyle) {ctx.font = ` normal ${textSize}px Arial`;if (fontStyle) {ctx.font = fontStyle;}if (typeof colorOrTexture === 'number') {let hex = colorOrTexture.toString(16);hex = hex.padStart(6, '0');colorOrTexture = '#' + hex;}
if (colorOrTexture instanceof Image) {var pattern = ctx.createPattern(colorOrTexture, 'repeat');ctx.fillStyle = pattern;} else {ctx.fillStyle = colorOrTexture;}ctx.fillText(text, x, y);},drawsphere: function(x, y, fill) {
var r = 50;ctx.beginPath();ctx.arc(x, y, r, 0, Math.PI * 2);ctx.closePath();if (typeof fill === 'number') {let hex = fill.toString(16);hex = hex.padStart(6, '0');fill = '#' + hex;}if (typeof fill === 'string') {ctx.fillStyle = fill;ctx.fill();} else if (fill instanceof Image) {var pattern = ctx.createPattern(fill, 'repeat');ctx.fillStyle = pattern;ctx.fill(); } }, drawline: function(x1, y1, x2, y2, thickness, fill) {  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);   ctx.lineWidth = thickness;  ctx.lineCap = "round";if (typeof fill === 'number') { let hex = fill.toString(16); hex = hex.padStart(6, '0');   fill = '#' + hex;}if (typeof fill === 'string') { ctx.strokeStyle = fill;} else if (fill instanceof Image) { var pattern = ctx.createPattern(fill, 'repeat');ctx.strokeStyle = pattern;} ctx.stroke();}};}
function CSS(selector, styles) {document.querySelectorAll(selector).forEach(function(el) {el.style.cssText = styles;});} 
function CSS_STYLES( styles ) {  
  let stylecss= document.createElement('style')
  stylecss.innerHTML=styles
  document.documentElement.appendChild(stylecss) }
function parseVar(value, bynum) {
  return Math.round(value / bynum) * bynum;
}
function getBase64Image(key, rsrc) {
      if (typeof rsrc !== "undefined" && rsrc[key]) {return "data:image/png;base64," + rsrc[key];} else {console.warn(`err: ${key}`);}}