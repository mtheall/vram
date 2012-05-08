function getParameterByName(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regex = new RegExp("[\\#&]" + name + "=([^&#]*)");
  var results = regex.exec(window.location.hash);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function hasParameterByName(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regex = new RegExp("[\\#&]" + name + "=([^&#]*)");
  var results = regex.exec(window.location.hash);
  if(results == null)
    return false;
  else
    return true;
}

function OListSize(obj)
{
  var size = 0;
  for (key in obj)
  {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
}

function OListGet(obj, idx)
{
  var off = 0;
  for (key in obj)
  {
    if (obj.hasOwnProperty(key))
    {
      if (idx == off) return obj[key];
      off++;
    }
  }
  return null;
}

function OListSet(obj, idx, val)
{
  var off = 0;
  for (key in obj)
  {
    if (obj.hasOwnProperty(key))
    {
      if (idx == off)
      {
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
  'A_LCD'   :'<span class="func">ARM9</span> <span class="numm">0x06800000 - 0x0681FFFF</span> <span class="deff">(128KB)</span>',
  'B_LCD'   :'<span class="func">ARM9</span> <span class="numm">0x06820000 - 0x0683FFFF</span> <span class="deff">(128KB)</span>',
  'C_LCD'   :'<span class="func">ARM9</span> <span class="numm">0x06840000 - 0x0685FFFF</span> <span class="deff">(128KB)</span>',
  'D_LCD'   :'<span class="func">ARM9</span> <span class="numm">0x06860000 - 0x0687FFFF</span> <span class="deff">(128KB)</span>',
  'E_LCD'   :'<span class="func">ARM9</span> <span class="numm">0x06880000 - 0x0688FFFF</span> <span class="deff">( 64KB)</span>',
  'F_LCD'   :'<span class="func">ARM9</span> <span class="numm">0x06890000 - 0x06893FFF</span> <span class="deff">( 16KB)</span>',
  'G_LCD'   :'<span class="func">ARM9</span> <span class="numm">0x06894000 - 0x06897FFF</span> <span class="deff">( 16KB)</span>',
  'H_LCD'   :'<span class="func">ARM9</span> <span class="numm">0x06898000 - 0x0689FFFF</span> <span class="deff">( 32KB)</span>',
  'I_LCD'   :'<span class="func">ARM9</span> <span class="numm">0x068A0000 - 0x068A3FFF</span> <span class="deff">( 16KB)</span>',

  // ARM7
  'C_ARM70' :'<span class="func">ARM7</span> <span class="numm">0x06000000 - 0x0601FFFF</span> <span class="deff">(128KB)</span>',
  'D_ARM70' :'<span class="func">ARM7</span> <span class="numm">0x06000000 - 0x0601FFFF</span> <span class="deff">(128KB)</span>',
  'C_ARM71' :'<span class="func">ARM7</span> <span class="numm">0x06020000 - 0x0603FFFF</span> <span class="deff">(128KB)</span>',
  'D_ARM71' :'<span class="func">ARM7</span> <span class="numm">0x06020000 - 0x0603FFFF</span> <span class="deff">(128KB)</span>',

  // Main Background
  'A_MBG0'  :'<span class="func">ARM9</span> <span class="numm">0x06000000 - 0x0601FFFF</span> <span class="deff">(128KB)</span>',
  'A_MBG1'  :'<span class="func">ARM9</span> <span class="numm">0x06020000 - 0x0603FFFF</span> <span class="deff">(128KB)</span>',
  'A_MBG2'  :'<span class="func">ARM9</span> <span class="numm">0x06040000 - 0x0605FFFF</span> <span class="deff">(128KB)</span>',
  'A_MBG3'  :'<span class="func">ARM9</span> <span class="numm">0x06060000 - 0x0607FFFF</span> <span class="deff">(128KB)</span>',
  'B_MBG0'  :'<span class="func">ARM9</span> <span class="numm">0x06000000 - 0x0601FFFF</span> <span class="deff">(128KB)</span>',
  'B_MBG1'  :'<span class="func">ARM9</span> <span class="numm">0x06020000 - 0x0603FFFF</span> <span class="deff">(128KB)</span>',
  'B_MBG2'  :'<span class="func">ARM9</span> <span class="numm">0x06040000 - 0x0605FFFF</span> <span class="deff">(128KB)</span>',
  'B_MBG3'  :'<span class="func">ARM9</span> <span class="numm">0x06060000 - 0x0607FFFF</span> <span class="deff">(128KB)</span>',
  'C_MBG0'  :'<span class="func">ARM9</span> <span class="numm">0x06000000 - 0x0601FFFF</span> <span class="deff">(128KB)</span>',
  'C_MBG1'  :'<span class="func">ARM9</span> <span class="numm">0x06020000 - 0x0603FFFF</span> <span class="deff">(128KB)</span>',
  'C_MBG2'  :'<span class="func">ARM9</span> <span class="numm">0x06040000 - 0x0605FFFF</span> <span class="deff">(128KB)</span>',
  'C_MBG3'  :'<span class="func">ARM9</span> <span class="numm">0x06060000 - 0x0607FFFF</span> <span class="deff">(128KB)</span>',
  'D_MBG0'  :'<span class="func">ARM9</span> <span class="numm">0x06000000 - 0x0601FFFF</span> <span class="deff">(128KB)</span>',
  'D_MBG1'  :'<span class="func">ARM9</span> <span class="numm">0x06020000 - 0x0603FFFF</span> <span class="deff">(128KB)</span>',
  'D_MBG2'  :'<span class="func">ARM9</span> <span class="numm">0x06040000 - 0x0605FFFF</span> <span class="deff">(128KB)</span>',
  'D_MBG3'  :'<span class="func">ARM9</span> <span class="numm">0x06060000 - 0x0607FFFF</span> <span class="deff">(128KB)</span>',
  'E_MBG'   :'<span class="func">ARM9</span> <span class="numm">0x06000000 - 0x0600FFFF</span> <span class="deff">( 64KB)</span>',
  'F_MBG00' :'<span class="func">ARM9</span> <span class="numm">0x06000000 - 0x06003FFF</span> <span class="deff">( 16KB)</span>',
  'F_MBG01' :'<span class="func">ARM9</span> <span class="numm">0x06004000 - 0x06007FFF</span> <span class="deff">( 16KB)</span>',
  'F_MBG02' :'<span class="func">ARM9</span> <span class="numm">0x06008000 - 0x0600BFFF</span> <span class="deff">( 16KB)</span>',
  'F_MBG03' :'<span class="func">ARM9</span> <span class="numm">0x0600C000 - 0x0600FFFF</span> <span class="deff">( 16KB)</span>',
  'G_MBG00' :'<span class="func">ARM9</span> <span class="numm">0x06000000 - 0x06003FFF</span> <span class="deff">( 16KB)</span>',
  'G_MBG01' :'<span class="func">ARM9</span> <span class="numm">0x06004000 - 0x06007FFF</span> <span class="deff">( 16KB)</span>',
  'G_MBG02' :'<span class="func">ARM9</span> <span class="numm">0x06008000 - 0x0600BFFF</span> <span class="deff">( 16KB)</span>',
  'G_MBG03' :'<span class="func">ARM9</span> <span class="numm">0x0600C000 - 0x0600FFFF</span> <span class="deff">( 16KB)</span>',

  // Main Sprite
  'A_MOBJ0' :'<span class="func">ARM9</span> <span class="numm">0x06400000 - 0x0641FFFF</span> <span class="deff">(128KB)</span>',
  'A_MOBJ1' :'<span class="func">ARM9</span> <span class="numm">0x06420000 - 0x0643FFFF</span> <span class="deff">(128KB)</span>',
  'B_MOBJ0' :'<span class="func">ARM9</span> <span class="numm">0x06400000 - 0x0641FFFF</span> <span class="deff">(128KB)</span>',
  'B_MOBJ1' :'<span class="func">ARM9</span> <span class="numm">0x06420000 - 0x0643FFFF</span> <span class="deff">(128KB)</span>',
  'E_MOBJ'  :'<span class="func">ARM9</span> <span class="numm">0x06400000 - 0x0640FFFF</span> <span class="deff">( 64KB)</span>',
  'F_MOBJ00':'<span class="func">ARM9</span> <span class="numm">0x06400000 - 0x06403FFF</span> <span class="deff">( 16KB)</span>',
  'F_MOBJ01':'<span class="func">ARM9</span> <span class="numm">0x06404000 - 0x06407FFF</span> <span class="deff">( 16KB)</span>',
  'F_MOBJ02':'<span class="func">ARM9</span> <span class="numm">0x06880000 - 0x0688FFFF</span> <span class="deff">( 64KB)</span>',
  'F_MOBJ03':'<span class="func">ARM9</span> <span class="numm">0x06410000 - 0x06413FFF</span> <span class="deff">( 16KB)</span>',
  'G_MOBJ00':'<span class="func">ARM9</span> <span class="numm">0x06400000 - 0x06403FFF</span> <span class="deff">( 16KB)</span>',
  'G_MOBJ01':'<span class="func">ARM9</span> <span class="numm">0x06404000 - 0x06407FFF</span> <span class="deff">( 16KB)</span>',
  'G_MOBJ02':'<span class="func">ARM9</span> <span class="numm">0x06880000 - 0x0688FFFF</span> <span class="deff">( 64KB)</span>',
  'G_MOBJ03':'<span class="func">ARM9</span> <span class="numm">0x06410000 - 0x06413FFF</span> <span class="deff">( 16KB)</span>',

  // Main Background Extended Palette
  'E_BGEPAL'  :'<span class="func">LCD:</span> <span class="numm">0x06880000 - 0x06887FFF</span> <span class="deff">( 32KB)</span>',
  'F_BGEPAL01':'<span class="func">LCD:</span> <span class="numm">0x06890000 - 0x06893FFF</span> <span class="deff">( 16KB)</span>',
  'F_BGEPAL23':'<span class="func">LCD:</span> <span class="numm">0x06894000 - 0x06897FFF</span> <span class="deff">( 16KB)</span>',
  'G_BGEPAL01':'<span class="func">LCD:</span> <span class="numm">0x06890000 - 0x06893FFF</span> <span class="deff">( 16KB)</span>',
  'G_BGEPAL23':'<span class="func">LCD:</span> <span class="numm">0x06894000 - 0x06897FFF</span> <span class="deff">( 16KB)</span>',

  // Main Sprite Extended Palette
  'F_OBJEPAL' :'<span class="func">LCD:</span> <span class="numm">0x06890000 - 0x06891FFF</span> <span class="deff">(  8KB)</span>',
  'G_OBJEPAL' :'<span class="func">LCD:</span> <span class="numm">0x06890000 - 0x06891FFF</span> <span class="deff">(  8KB)</span>',

  // Sub Background
  'C_SBG' :'<span class="func">ARM9</span> <span class="numm">0x06200000 - 0x0621FFFF</span> <span class="deff">(128KB)</span>',
  'H_SBG0':'<span class="func">ARM9</span> <span class="numm">0x06200000 - 0x06207FFF</span> <span class="deff">( 32KB)</span>',
  'I_SBG1':'<span class="func">ARM9</span> <span class="numm">0x06208000 - 0x0620BFFF</span> <span class="deff">( 16KB)</span>',

  // Sub Sprite
  'D_SOBJ':'<span class="func">ARM9</span> <span class="numm">0x06600000 - 0x0661FFFF</span> <span class="deff">(128KB)</span>',
  'I_SOBJ':'<span class="func">ARM9</span> <span class="numm">0x06600000 - 0x06603FFF</span> <span class="deff">( 16KB)</span>',

  // Sub Background Extended Palette
  'H_SBGEPAL' :'<span class="func">LCD:</span> <span class="numm">0x06898000 - 0x0689FFFF</span> <span class="deff">( 32KB)</span>',

  // Sub Sprite Extended Palette
  'I_SOBJEPAL':'<span class="func">LCD:</span> <span class="numm">0x068A0000 - 0x068A3FFF</span> <span class="deff">( 16KB)</span>',

  // Texture Slot 0
  'A_TS0':'<span class="func">LCD:</span> <span class="numm">0x06800000 - 0x0681FFFF</span> <span class="deff">(128KB)</span>',
  'B_TS0':'<span class="func">LCD:</span> <span class="numm">0x06800000 - 0x0681FFFF</span> <span class="deff">(128KB)</span>',
  'C_TS0':'<span class="func">LCD:</span> <span class="numm">0x06800000 - 0x0681FFFF</span> <span class="deff">(128KB)</span>',
  'D_TS0':'<span class="func">LCD:</span> <span class="numm">0x06800000 - 0x0681FFFF</span> <span class="deff">(128KB)</span>',

  // Texture Slot 1
  'A_TS1':'<span class="func">LCD:</span> <span class="numm">0x06820000 - 0x0683FFFF</span> <span class="deff">(128KB)</span>',
  'B_TS1':'<span class="func">LCD:</span> <span class="numm">0x06820000 - 0x0683FFFF</span> <span class="deff">(128KB)</span>',
  'C_TS1':'<span class="func">LCD:</span> <span class="numm">0x06820000 - 0x0683FFFF</span> <span class="deff">(128KB)</span>',
  'D_TS1':'<span class="func">LCD:</span> <span class="numm">0x06820000 - 0x0683FFFF</span> <span class="deff">(128KB)</span>',

  // Texture Slot 2
  'A_TS2':'<span class="func">LCD:</span> <span class="numm">0x06840000 - 0x0685FFFF</span> <span class="deff">(128KB)</span>',
  'B_TS2':'<span class="func">LCD:</span> <span class="numm">0x06840000 - 0x0685FFFF</span> <span class="deff">(128KB)</span>',
  'C_TS2':'<span class="func">LCD:</span> <span class="numm">0x06840000 - 0x0685FFFF</span> <span class="deff">(128KB)</span>',
  'D_TS2':'<span class="func">LCD:</span> <span class="numm">0x06840000 - 0x0685FFFF</span> <span class="deff">(128KB)</span>',

  // Texture Slot 3
  'A_TS3':'<span class="func">LCD:</span> <span class="numm">0x06860000 - 0x0687FFFF</span> <span class="deff">(128KB)</span>',
  'B_TS3':'<span class="func">LCD:</span> <span class="numm">0x06860000 - 0x0687FFFF</span> <span class="deff">(128KB)</span>',
  'C_TS3':'<span class="func">LCD:</span> <span class="numm">0x06860000 - 0x0687FFFF</span> <span class="deff">(128KB)</span>',
  'D_TS3':'<span class="func">LCD:</span> <span class="numm">0x06860000 - 0x0687FFFF</span> <span class="deff">(128KB)</span>',

  // Texture Palette
  'E_TPAL' :'<span class="func">LCD:</span> <span class="numm">0x06880000 - 0x0688FFFF</span> <span class="deff">( 64KB)</span>',
  'F_TPAL0':'<span class="func">LCD:</span> <span class="numm">0x06890000 - 0x06893FFF</span> <span class="deff">( 16KB)</span>',
  'G_TPAL0':'<span class="func">LCD:</span> <span class="numm">0x06890000 - 0x06893FFF</span> <span class="deff">( 16KB)</span>',
  'F_TPAL1':'<span class="func">LCD:</span> <span class="numm">0x06894000 - 0x06897FFF</span> <span class="deff">( 16KB)</span>',
  'G_TPAL1':'<span class="func">LCD:</span> <span class="numm">0x06894000 - 0x06897FFF</span> <span class="deff">( 16KB)</span>',
  'F_TPAL4':'<span class="func">LCD:</span> <span class="numm">0x06890000 - 0x06893FFF</span> <span class="deff">( 16KB)</span>',
  'G_TPAL4':'<span class="func">LCD:</span> <span class="numm">0x06890000 - 0x06893FFF</span> <span class="deff">( 16KB)</span>',
  'F_TPAL5':'<span class="func">LCD:</span> <span class="numm">0x06894000 - 0x06897FFF</span> <span class="deff">( 16KB)</span>',
  'G_TPAL5':'<span class="func">LCD:</span> <span class="numm">0x06894000 - 0x06897FFF</span> <span class="deff">( 16KB)</span>',
};

var Sel = {'A':'', 'B':'', 'C':'', 'D':'', 'E':'', 'F':'', 'G':'', 'H':'', 'I':''};
var Err = {'A':'', 'B':'', 'C':'', 'D':'', 'E':'', 'F':'', 'G':'', 'H':'', 'I':''};

function loadp()
{
  var i, allElem = document.forms["banks"].elements;

  // Load parameters
  if (hasParameterByName('A')) Sel['A'] = getParameterByName('A');
  if (hasParameterByName('B')) Sel['B'] = getParameterByName('B');
  if (hasParameterByName('C')) Sel['C'] = getParameterByName('C');
  if (hasParameterByName('D')) Sel['D'] = getParameterByName('D');
  if (hasParameterByName('E')) Sel['E'] = getParameterByName('E');
  if (hasParameterByName('F')) Sel['F'] = getParameterByName('F');
  if (hasParameterByName('G')) Sel['G'] = getParameterByName('G');
  if (hasParameterByName('H')) Sel['H'] = getParameterByName('H');
  if (hasParameterByName('I')) Sel['I'] = getParameterByName('I');

  // Mark selected items
  for (var i=0; i < allElem.length; i++)
  {
    Elem = allElem[i];
    if (Sel[Elem.name] == Elem.value)
      Elem.checked = true;
  }

  // Update
  upd();
}

function upd()
{
  var allElem = document.forms["banks"].elements;
  var i, a, b, ShareLink;
  var numerr = 0;

  // Find selected items
  for (var i = 0; i < allElem.length; i++)
  {
    Elem = allElem[i];
    ElemName = Elem.name + "_" + Elem.value;
    if (Elem.checked)
    {
      Sel[Elem.name] = Elem.value;
    }
  }

  // Detect errors
  for (var a = 0; a < 9; a++)
    OListSet(Err, a, 0);

  for (var a = 0; a < 9; a++)
  {
    for (var b = a+1; b < 9; b++)
    {
      cma = BankingMap['m'+OListGet(Sel, a)];
      cmb = BankingMap['m'+OListGet(Sel, b)];
      for (c = 0; c < OListSize(cma); c++)
      {
        if (cmb.indexOf(cma.charAt(c)) != -1)
        {
          if (OListGet(Err, a) == 0)
          {
            numerr++;
            OListSet(Err, a, 1);
          }
          if (OListGet(Err, b) == 0)
          {
            numerr++;
            OListSet(Err, b, 1);
          }
        }
      }
    }
  }

  // Mark valid/conflicts on the table
  for (var i=0; i < allElem.length; i++)
  {
    Elem = allElem[i];
    ElemName = Elem.name + "_" + Elem.value;
    if (Elem.checked)
    {
      if (Err[Elem.name] == 0)
        document.getElementById(ElemName).className = 'g';
      else
        document.getElementById(ElemName).className = 'r';
    }
    else
      document.getElementById(ElemName).className = '';
  }

  // Write result
  Notify = document.getElementById('Notify');
  if (numerr == 0)
  {
    Notify.style.color = "#008000";
    Notify.innerHTML = "No conflict found ";
  }
  else {
    Notify.style.color = "#C00000";
    Notify.innerHTML = "Found " + numerr + " conflicts at banks: ";
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
  if (numerr == 0)
  {
    FCall.innerHTML =  "<span class='func'>vramSetBankA</span>(<span class='deff'>VRAM_A_" + BankingMap['f'+Sel['A']] + "</span>);<br />";
    FCall.innerHTML += "<span class='func'>vramSetBankB</span>(<span class='deff'>VRAM_B_" + BankingMap['f'+Sel['B']] + "</span>);<br />";
    FCall.innerHTML += "<span class='func'>vramSetBankC</span>(<span class='deff'>VRAM_C_" + BankingMap['f'+Sel['C']] + "</span>);<br />";
    FCall.innerHTML += "<span class='func'>vramSetBankD</span>(<span class='deff'>VRAM_D_" + BankingMap['f'+Sel['D']] + "</span>);<br />";
    FCall.innerHTML += "<span class='func'>vramSetBankE</span>(<span class='deff'>VRAM_E_" + BankingMap['f'+Sel['E']] + "</span>);<br />";
    FCall.innerHTML += "<span class='func'>vramSetBankF</span>(<span class='deff'>VRAM_F_" + BankingMap['f'+Sel['F']] + "</span>);<br />";
    FCall.innerHTML += "<span class='func'>vramSetBankG</span>(<span class='deff'>VRAM_G_" + BankingMap['f'+Sel['G']] + "</span>);<br />";
    FCall.innerHTML += "<span class='func'>vramSetBankH</span>(<span class='deff'>VRAM_H_" + BankingMap['f'+Sel['H']] + "</span>);<br />";
    FCall.innerHTML += "<span class='func'>vramSetBankI</span>(<span class='deff'>VRAM_I_" + BankingMap['f'+Sel['I']] + "</span>);<br />";
  }
  else
    FCall.innerHTML =  "Error: Conflict found!";

  // Generate the cpu access
  CPUAcc = document.getElementById('CPUAccess');
  if (numerr == 0)
  {
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

  // Generate sharing link
  ShareLink = "";
  if (Sel['A'] != "LCD") ShareLink += "&A=" + Sel['A'];
  if (Sel['B'] != "LCD") ShareLink += "&B=" + Sel['B'];
  if (Sel['C'] != "LCD") ShareLink += "&C=" + Sel['C'];
  if (Sel['D'] != "LCD") ShareLink += "&D=" + Sel['D'];
  if (Sel['E'] != "LCD") ShareLink += "&E=" + Sel['E'];
  if (Sel['F'] != "LCD") ShareLink += "&F=" + Sel['F'];
  if (Sel['G'] != "LCD") ShareLink += "&G=" + Sel['G'];
  if (Sel['H'] != "LCD") ShareLink += "&H=" + Sel['H'];
  if (Sel['I'] != "LCD") ShareLink += "&I=" + Sel['I'];
  ShareLink = "#" + ShareLink.substring(1);
  document.getElementById('ShareLink').innerHTML = "<a href=" + ShareLink + ">" + ShareLink + "</a>";
  window.location.hash = ShareLink;
}
