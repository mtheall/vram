function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function OListSize(obj) {
  var size = 0;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
}

function OListGet(obj, idx) {
  var off = 0;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (idx == off) return obj[key];
      off++;
    }
  }
  return null;
}

function OListSet(obj, idx, val) {
  var off = 0;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (idx == off) {
        obj[key] = val;
        return;
      }
      off++;
    }
  }
}

// m = Conflict map
// f = Function call
var BankingMap = {
  'mLCD'     :'',     'fLCD'     :'LCD',
  'mARM70'   :'a',    'fARM70'   :'ARM7_0x06000000',
  'mARM71'   :'b',    'fARM71'   :'ARM7_0x06020000',
  'mMBG0'    :'cdef', 'fMBG0'    :'MAIN_BG_0x06000000',
  'mMBG'     :'cd',   'fMBG'     :'BG',
  'mMBG00'   :'c',    'fMBG00'   :'MAIN_BG_0x06000000',
  'mMBG01'   :'d',    'fMBG01'   :'MAIN_BG_0x06004000',
  'mMBG02'   :'e',    'fMBG02'   :'MAIN_BG_0x06010000',
  'mMBG03'   :'f',    'fMBG03'   :'MAIN_BG_0x06014000',
  'mMBG1'    :'g',    'fMBG1'    :'MAIN_BG_0x06020000',
  'mMBG2'    :'h',    'fMBG2'    :'MAIN_BG_0x06040000',
  'mMBG3'    :'i',    'fMBG3'    :'MAIN_BG_0x06060000',
  'mMOBJ0'   :'jklm', 'fMOBJ0'   :'MAIN_SPRITE_0x06400000',
  'mMOBJ'    :'jk',   'fMOBJ'    :'MAIN_SPRITE',
  'mMOBJ00'  :'j',    'fMOBJ00'  :'MAIN_SPRITE_0x06400000',
  'mMOBJ01'  :'k',    'fMOBJ01'  :'MAIN_SPRITE_0x06404000',
  'mMOBJ02'  :'l',    'fMOBJ02'  :'MAIN_SPRITE_0x06410000',
  'mMOBJ03'  :'m',    'fMOBJ03'  :'MAIN_SPRITE_0x06414000',
  'mMOBJ1'   :'n',    'fMOBJ1'   :'MAIN_SPRITE_0x06420000',
  'mBGEPAL'  :'op',   'fBGEPAL'  :'BG_EXT_PALETTE',
  'mBGEPAL01':'o',    'fBGEPAL01':'BG_EXT_PALETTE_SLOT01',
  'mBGEPAL23':'p',    'fBGEPAL23':'BG_EXT_PALETTE_SLOT23',
  'mOBJEPAL' :'q',    'fOBJEPAL' :'SPRITE_EXT_PALETTE',
  'mSBG'     :'rs',   'fSBG'     :'SUB_BG_0x06200000',
  'mSBG0'    :'r',    'fSBG0'    :'SUB_BG',
  'mSBG1'    :'s',    'fSBG1'    :'SUB_BG_0x06208000',
  'mSOBJ'    :'t',    'fSOBJ'    :'SUB_SPRITE',
  'mSBGEPAL' :'u',    'fSBGEPAL' :'SUB_BG_EXT_PALETTE',
  'mSOBJEPAL':'v',    'fSOBJEPAL':'SUB_SPRITE_EXT_PALETTE',
  'mTS0'     :'w',    'fTS0'     :'TEXTURE_SLOT0',
  'mTS1'     :'x',    'fTS1'     :'TEXTURE_SLOT1',
  'mTS2'     :'y',    'fTS2'     :'TEXTURE_SLOT2',
  'mTS3'     :'z',    'fTS3'     :'TEXTURE_SLOT3',
  'mTPAL'    :'01',   'fTPAL'    :'TEX_PALETTE',
  'mTPAL0'   :'0',    'fTPAL0'   :'TEX_PALETTE_SLOT0',
  'mTPAL1'   :'1',    'fTPAL1'   :'TEX_PALETTE_SLOT1',
  'mTPAL4'   :'2',    'fTPAL4'   :'TEX_PALETTE_SLOT4',
  'mTPAL5'   :'3',    'fTPAL5'   :'TEX_PALETTE_SLOT5',
};

var CPUAccessMap = {
  // LCD
  'A_LCD'   :'ARM9 0x06800000 - 0x0681FFFF (128KB)',
  'B_LCD'   :'ARM9 0x06820000 - 0x0683FFFF (128KB)',
  'C_LCD'   :'ARM9 0x06840000 - 0x0685FFFF (128KB)',
  'D_LCD'   :'ARM9 0x06860000 - 0x0687FFFF (128KB)',
  'E_LCD'   :'ARM9 0x06880000 - 0x0688FFFF ( 64KB)',
  'F_LCD'   :'ARM9 0x06890000 - 0x06893FFF ( 16KB)',
  'G_LCD'   :'ARM9 0x06894000 - 0x06897FFF ( 16KB)',
  'H_LCD'   :'ARM9 0x06898000 - 0x0689FFFF ( 32KB)',
  'I_LCD'   :'ARM9 0x068A0000 - 0x068A3FFF ( 16KB)',

  // ARM7
  'C_ARM70' :'ARM7 0x06000000 - 0x0601FFFF (128KB)',
  'D_ARM70' :'ARM7 0x06000000 - 0x0601FFFF (128KB)',
  'C_ARM71' :'ARM7 0x06020000 - 0x0603FFFF (128KB)',
  'D_ARM71' :'ARM7 0x06020000 - 0x0603FFFF (128KB)',

  // Main Background
  'A_MBG0'  :'ARM9 0x06000000 - 0x0601FFFF (128KB)',
  'A_MBG1'  :'ARM9 0x06020000 - 0x0603FFFF (128KB)',
  'A_MBG2'  :'ARM9 0x06040000 - 0x0605FFFF (128KB)',
  'A_MBG3'  :'ARM9 0x06060000 - 0x0607FFFF (128KB)',
  'B_MBG0'  :'ARM9 0x06000000 - 0x0601FFFF (128KB)',
  'B_MBG1'  :'ARM9 0x06020000 - 0x0603FFFF (128KB)',
  'B_MBG2'  :'ARM9 0x06040000 - 0x0605FFFF (128KB)',
  'B_MBG3'  :'ARM9 0x06060000 - 0x0607FFFF (128KB)',
  'C_MBG0'  :'ARM9 0x06000000 - 0x0601FFFF (128KB)',
  'C_MBG1'  :'ARM9 0x06020000 - 0x0603FFFF (128KB)',
  'C_MBG2'  :'ARM9 0x06040000 - 0x0605FFFF (128KB)',
  'C_MBG3'  :'ARM9 0x06060000 - 0x0607FFFF (128KB)',
  'D_MBG0'  :'ARM9 0x06000000 - 0x0601FFFF (128KB)',
  'D_MBG1'  :'ARM9 0x06020000 - 0x0603FFFF (128KB)',
  'D_MBG2'  :'ARM9 0x06040000 - 0x0605FFFF (128KB)',
  'D_MBG3'  :'ARM9 0x06060000 - 0x0607FFFF (128KB)',
  'E_MBG'   :'ARM9 0x06000000 - 0x0600FFFF ( 64KB)',
  'F_MBG00' :'ARM9 0x06000000 - 0x06003FFF ( 16KB)',
  'F_MBG01' :'ARM9 0x06004000 - 0x06007FFF ( 16KB)',
  'F_MBG02' :'ARM9 0x06008000 - 0x0600BFFF ( 16KB)',
  'F_MBG03' :'ARM9 0x0600C000 - 0x0600FFFF ( 16KB)',
  'G_MBG00' :'ARM9 0x06000000 - 0x06003FFF ( 16KB)',
  'G_MBG01' :'ARM9 0x06004000 - 0x06007FFF ( 16KB)',
  'G_MBG02' :'ARM9 0x06008000 - 0x0600BFFF ( 16KB)',
  'G_MBG03' :'ARM9 0x0600C000 - 0x0600FFFF ( 16KB)',

  // Main Sprite
  'A_MOBJ0' :'ARM9 0x06400000 - 0x0641FFFF (128KB)',
  'A_MOBJ1' :'ARM9 0x06420000 - 0x0643FFFF (128KB)',
  'B_MOBJ0' :'ARM9 0x06400000 - 0x0641FFFF (128KB)',
  'B_MOBJ1' :'ARM9 0x06420000 - 0x0643FFFF (128KB)',
  'E_MOBJ'  :'ARM9 0x06400000 - 0x0640FFFF ( 64KB)',
  'F_MOBJ00':'ARM9 0x06400000 - 0x06403FFF ( 16KB)',
  'F_MOBJ01':'ARM9 0x06404000 - 0x06407FFF ( 16KB)',
  'F_MOBJ02':'ARM9 0x06880000 - 0x0688FFFF ( 64KB)',
  'F_MOBJ03':'ARM9 0x06410000 - 0x06413FFF ( 16KB)',
  'G_MOBJ00':'ARM9 0x06400000 - 0x06403FFF ( 16KB)',
  'G_MOBJ01':'ARM9 0x06404000 - 0x06407FFF ( 16KB)',
  'G_MOBJ02':'ARM9 0x06880000 - 0x0688FFFF ( 64KB)',
  'G_MOBJ03':'ARM9 0x06410000 - 0x06413FFF ( 16KB)',

  // Main Background Extended Palette
  'E_BGEPAL'  :'LCD: 0x06880000 - 0x06887FFF ( 32KB)',
  'F_BGEPAL01':'LCD: 0x06890000 - 0x06893FFF ( 16KB)',
  'F_BGEPAL23':'LCD: 0x06894000 - 0x06897FFF ( 16KB)',
  'G_BGEPAL01':'LCD: 0x06890000 - 0x06893FFF ( 16KB)',
  'G_BGEPAL23':'LCD: 0x06894000 - 0x06897FFF ( 16KB)',

  // Main Sprite Extended Palette
  'F_OBJEPAL' :'LCD: 0x06890000 - 0x06891FFF (  8KB)',
  'G_OBJEPAL' :'LCD: 0x06890000 - 0x06891FFF (  8KB)',

  // Sub Background
  'C_SBG' :'ARM9 0x06200000 - 0x0621FFFF (128KB)',
  'H_SBG0':'ARM9 0x06200000 - 0x06207FFF ( 32KB)',
  'I_SBG1':'ARM9 0x06208000 - 0x0620BFFF ( 16KB)',

  // Sub Sprite
  'D_SOBJ':'ARM9 0x06600000 - 0x0661FFFF (128KB)',
  'I_SOBJ':'ARM9 0x06600000 - 0x06603FFF ( 16KB)',

  // Sub Background Extended Palette
  'H_SBGEPAL' :'LCD: 0x06898000 - 0x0689FFFF ( 32KB)',

  // Sub Sprite Extended Palette
  'I_SOBJEPAL':'LCD: 0x068A0000 - 0x068A3FFF ( 16KB)',

  // Texture Slot 0
  'A_TS0':'LCD: 0x06800000 - 0x0681FFFF (128KB)',
  'B_TS0':'LCD: 0x06800000 - 0x0681FFFF (128KB)',
  'C_TS0':'LCD: 0x06800000 - 0x0681FFFF (128KB)',
  'D_TS0':'LCD: 0x06800000 - 0x0681FFFF (128KB)',

  // Texture Slot 1
  'A_TS1':'LCD: 0x06820000 - 0x0683FFFF (128KB)',
  'B_TS1':'LCD: 0x06820000 - 0x0683FFFF (128KB)',
  'C_TS1':'LCD: 0x06820000 - 0x0683FFFF (128KB)',
  'D_TS1':'LCD: 0x06820000 - 0x0683FFFF (128KB)',

  // Texture Slot 2
  'A_TS2':'LCD: 0x06840000 - 0x0685FFFF (128KB)',
  'B_TS2':'LCD: 0x06840000 - 0x0685FFFF (128KB)',
  'C_TS2':'LCD: 0x06840000 - 0x0685FFFF (128KB)',
  'D_TS2':'LCD: 0x06840000 - 0x0685FFFF (128KB)',

  // Texture Slot 3
  'A_TS3':'LCD: 0x06860000 - 0x0687FFFF (128KB)',
  'B_TS3':'LCD: 0x06860000 - 0x0687FFFF (128KB)',
  'C_TS3':'LCD: 0x06860000 - 0x0687FFFF (128KB)',
  'D_TS3':'LCD: 0x06860000 - 0x0687FFFF (128KB)',

  // Texture Palette
  'E_TPAL' :'LCD: 0x06880000 - 0x0688FFFF ( 64KB)',
  'F_TPAL0':'LCD: 0x06890000 - 0x06893FFF ( 16KB)',
  'G_TPAL0':'LCD: 0x06890000 - 0x06893FFF ( 16KB)',
  'F_TPAL1':'LCD: 0x06894000 - 0x06897FFF ( 16KB)',
  'G_TPAL1':'LCD: 0x06894000 - 0x06897FFF ( 16KB)',
  'F_TPAL4':'LCD: 0x06890000 - 0x06893FFF ( 16KB)',
  'G_TPAL4':'LCD: 0x06890000 - 0x06893FFF ( 16KB)',
  'F_TPAL5':'LCD: 0x06894000 - 0x06897FFF ( 16KB)',
  'G_TPAL5':'LCD: 0x06894000 - 0x06897FFF ( 16KB)',
};

var Sel = {'A':'', 'B':'', 'C':'', 'D':'', 'E':'', 'F':'', 'G':'', 'H':'', 'I':''};
var Err = {'A':'', 'B':'', 'C':'', 'D':'', 'E':'', 'F':'', 'G':'', 'H':'', 'I':''};

function loadp() {
  var allElem = document.forms["banks"].elements;

  // Load parameters
  Sel['A'] = getParameterByName('A');
  Sel['B'] = getParameterByName('B');
  Sel['C'] = getParameterByName('C');
  Sel['D'] = getParameterByName('D');
  Sel['E'] = getParameterByName('E');
  Sel['F'] = getParameterByName('F');
  Sel['G'] = getParameterByName('G');
  Sel['H'] = getParameterByName('H');
  Sel['I'] = getParameterByName('I');

  // Mark selected items
  for (var el = 0; el < allElem.length; el++) {
    Elem = allElem[el];
    if (Sel[Elem.name] == Elem.value)
      Elem.checked = true;
  }

  upd();
}

function upd() {
  var allElem = document.forms["banks"].elements;
  var numerr = 0;

  // Find selected items
  for (var el = 0; el < allElem.length; el++) {
    Elem = allElem[el];
    ElemName = Elem.name + "_" + Elem.value;
    if (Elem.checked)
      Sel[Elem.name] = Elem.value;
  }

  // Detect errors
  for (var a = 0; a < 9; a++)
    OListSet(Err, a, 0);

  for (var a = 0; a < 9; a++) {
    for (var b = a+1; b < 9; b++) {
      cma = BankingMap['m'+OListGet(Sel, a)];
      cmb = BankingMap['m'+OListGet(Sel, b)];
      for (c = 0; c < OListSize(cma); c++) {
        if (cmb.indexOf(cma.charAt(c)) != -1) {
          if (OListGet(Err, a) == 0) {
            numerr++;
            OListSet(Err, a, 1);
          }
          if (OListGet(Err, b) == 0) {
            numerr++;
            OListSet(Err, b, 1);
          }
        }
      }
    }
  }

  // Mark valid/conflicts on the table
  for (var el = 0; el < allElem.length; el++) {
    Elem = allElem[el];
    ElemName = Elem.name + "_" + Elem.value;
    if (Elem.checked) {
      if (Err[Elem.name] == 0)
        document.getElementById(ElemName).className = 'g';
      else
        document.getElementById(ElemName).className = 'r';
    }
    else
      document.getElementById(ElemName).className = '';
  }

  // Write result
  linkcode  =  "A="+Sel['A'];
  linkcode += "&B="+Sel['B'];
  linkcode += "&C="+Sel['C'];
  linkcode += "&D="+Sel['D'];
  linkcode += "&E="+Sel['E'];
  linkcode += "&F="+Sel['F'];
  linkcode += "&G="+Sel['G'];
  linkcode += "&H="+Sel['H'];
  linkcode += "&I="+Sel['I'];

  Notify = document.getElementById('Notify');
  Notify.innerHTML = "<a href='?" + linkcode + "'>(Share Link)</a> - ";
  if (numerr == 0) {
    Notify.style.color = "#008000";
    Notify.innerHTML += "No conflict found ";
  }
  else {
    Notify.style.color = "#C00000";
    Notify.innerHTML += "Found " + numerr + " conflicts at banks: ";

    if (Err['A']) Notify.innerHTML += "VRAM_A ";
    if (Err['B']) Notify.innerHTML += "VRAM_B ";
    if (Err['C']) Notify.innerHTML += "VRAM_C ";
    if (Err['D']) Notify.innerHTML += "VRAM_D ";
    if (Err['E']) Notify.innerHTML += "VRAM_E ";
    if (Err['F']) Notify.innerHTML += "VRAM_F ";
    if (Err['G']) Notify.innerHTML += "VRAM_G ";
    if (Err['H']) Notify.innerHTML += "VRAM_H ";
    if (Err['I']) Notify.innerHTML += "VRAM_I ";
  }

  // Generate the function call
  FCall = document.getElementById('FunctionCall');
  if (numerr == 0) {
    FCall.innerHTML =  "vramSetBankA(VRAM_A_" + BankingMap['f'+Sel['A']] + ");<br />";
    FCall.innerHTML += "vramSetBankB(VRAM_B_" + BankingMap['f'+Sel['B']] + ");<br />";
    FCall.innerHTML += "vramSetBankC(VRAM_C_" + BankingMap['f'+Sel['C']] + ");<br />";
    FCall.innerHTML += "vramSetBankD(VRAM_D_" + BankingMap['f'+Sel['D']] + ");<br />";
    FCall.innerHTML += "vramSetBankE(VRAM_E_" + BankingMap['f'+Sel['E']] + ");<br />";
    FCall.innerHTML += "vramSetBankF(VRAM_F_" + BankingMap['f'+Sel['F']] + ");<br />";
    FCall.innerHTML += "vramSetBankG(VRAM_G_" + BankingMap['f'+Sel['G']] + ");<br />";
    FCall.innerHTML += "vramSetBankH(VRAM_H_" + BankingMap['f'+Sel['H']] + ");<br />";
    FCall.innerHTML += "vramSetBankI(VRAM_I_" + BankingMap['f'+Sel['I']] + ");<br />";
  }
  else
    FCall.innerHTML =  "Error: Conflict found!";

  // Generate the function call
  CPUAcc = document.getElementById('CPUAccess');
  if (numerr == 0) {
    CPUAcc.innerHTML =  "<b>A:</b> " + CPUAccessMap['A_'+Sel['A']] + "<br />";
    CPUAcc.innerHTML += "<b>B:</b> " + CPUAccessMap['B_'+Sel['B']] + "<br />";
    CPUAcc.innerHTML += "<b>C:</b> " + CPUAccessMap['C_'+Sel['C']] + "<br />";
    CPUAcc.innerHTML += "<b>D:</b> " + CPUAccessMap['D_'+Sel['D']] + "<br />";
    CPUAcc.innerHTML += "<b>E:</b> " + CPUAccessMap['E_'+Sel['E']] + "<br />";
    CPUAcc.innerHTML += "<b>F:</b> " + CPUAccessMap['F_'+Sel['F']] + "<br />";
    CPUAcc.innerHTML += "<b>G:</b> " + CPUAccessMap['G_'+Sel['G']] + "<br />";
    CPUAcc.innerHTML += "<b>H:</b> " + CPUAccessMap['H_'+Sel['H']] + "<br />";
    CPUAcc.innerHTML += "<b>I:</b> " + CPUAccessMap['I_'+Sel['I']] + "<br />";
  }
  else
    CPUAcc.innerHTML =  "Error: Conflict found!";
}

