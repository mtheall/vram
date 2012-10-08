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

function V2Digits(size)
{
  return Math.round(size * 100) / 100;
}

var SubEngine = 0;
var DISPCNT_MapBase = 0;
var DISPCNT_TileBase = 0;

// 0 = Empty
// 1 = Valid (Tileset)
// 2 = Valid (Bitmap)
// 3 = Warning
// 4 = Error
// 5 = Out of range empty
// 6 = Out of range error
var ColorCode = [
  "#DFDFFF", "#00FF00", "#00FF00", "#FFFF00", "#FF0000", "#777777", "#804000"
];
var WorkModes = [
  0,  0,  0,  1,  3, 3, 3, -1,
  0,  0,  0,  1,  3, 3, 3, -1,
  0,  0,  0,  1,  3, 3, 3, -1,
  2, -1, -1,  2,  4, 4, 4, -1,
  5, -1, -1, -1,  5, 5, 5, -1,
  5, -1, -1, -1,  5, 5, 5, -1,
  5, -1, -1, -1,  5, 5, 5, -1
];

var VRAM_BGMapping = Array();
var VRAM_BGError = Array();
var VRAM_BGSpace = Array();

var BGType_TSiz = [1, 2, 2, 4];
var BGType_RSiz = [0.125, 1, 2, 8];
var BGType_ERSiz = [0.25, 1, 4, 16];
var BGType_B8Siz = [8, 24, 32, 64, 128, 256, 256];
var BGType_B16Siz = [16, 48, 64, 128, 256];

var ShareLink;
var Function_Call;
var CPU_Access;
var MaxAllocated;

function loadp()
{
  var i, j;

  // Initialize 2D array
  for (i=0; i<8; i++) VRAM_BGMapping[i] = Array();

  // Setup options
  if (hasParameterByName('SUB')) document.forms['bgvram'].SubEngine.checked = (getParameterByName('SUB') != 0) ? true : false;
  if (hasParameterByName('MS')) document.forms['bgvram'].MS.options.selectedIndex = getParameterByName('MS');
  if (hasParameterByName('TS')) document.forms['bgvram'].TS.options.selectedIndex = getParameterByName('TS');
  if (hasParameterByName('T0')) document.forms['bgvram'].T0.options.selectedIndex = getParameterByName('T0');
  if (hasParameterByName('NT0')) document.forms['bgvram'].NT0.options.selectedIndex = (getParameterByName('NT0') / 32) - 1;
  if (hasParameterByName('MB0')) document.forms['bgvram'].MB0.options.selectedIndex = getParameterByName('MB0');
  if (hasParameterByName('TB0')) document.forms['bgvram'].TB0.options.selectedIndex = getParameterByName('TB0');
  if (hasParameterByName('S0')) document.forms['bgvram'].TS0.options.selectedIndex = getParameterByName('S0');
  if (hasParameterByName('T1')) document.forms['bgvram'].T1.options.selectedIndex = getParameterByName('T1');
  if (hasParameterByName('NT1')) document.forms['bgvram'].NT1.options.selectedIndex = (getParameterByName('NT1') / 32) - 1;
  if (hasParameterByName('MB1')) document.forms['bgvram'].MB1.options.selectedIndex = getParameterByName('MB1');
  if (hasParameterByName('TB1')) document.forms['bgvram'].TB1.options.selectedIndex = getParameterByName('TB1');
  if (hasParameterByName('S1')) document.forms['bgvram'].TS1.options.selectedIndex = getParameterByName('S1');
  if (hasParameterByName('T2')) document.forms['bgvram'].T2.options.selectedIndex = getParameterByName('T2');
  if (hasParameterByName('NT2')) document.forms['bgvram'].NT2.options.selectedIndex = (getParameterByName('NT2') / 32) - 1;
  if (hasParameterByName('MB2')) document.forms['bgvram'].MB2.options.selectedIndex = getParameterByName('MB2');
  if (hasParameterByName('TB2')) document.forms['bgvram'].TB2.options.selectedIndex = getParameterByName('TB2');
  if (hasParameterByName('S2'))
  {
    document.forms['bgvram'].TS2.options.selectedIndex = getParameterByName('S2');
    document.forms['bgvram'].RS2.options.selectedIndex = getParameterByName('S2');
    document.forms['bgvram'].ERS2.options.selectedIndex = getParameterByName('S2');
    document.forms['bgvram'].B8S2.options.selectedIndex = getParameterByName('S2');
    document.forms['bgvram'].B16S2.options.selectedIndex = getParameterByName('S2');
  }
  if (hasParameterByName('T3')) document.forms['bgvram'].T3.options.selectedIndex = getParameterByName('T3');
  if (hasParameterByName('NT3')) document.forms['bgvram'].NT3.options.selectedIndex = (getParameterByName('NT3') / 32) - 1;
  if (hasParameterByName('MB3')) document.forms['bgvram'].MB3.options.selectedIndex = getParameterByName('MB3');
  if (hasParameterByName('TB3')) document.forms['bgvram'].TB3.options.selectedIndex = getParameterByName('TB3');
  if (hasParameterByName('S3'))
  {
    document.forms['bgvram'].TS3.options.selectedIndex = getParameterByName('S3');
    document.forms['bgvram'].RS3.options.selectedIndex = getParameterByName('S3');
    document.forms['bgvram'].ERS3.options.selectedIndex = getParameterByName('S3');
    document.forms['bgvram'].B8S3.options.selectedIndex = getParameterByName('S3');
    document.forms['bgvram'].B16S3.options.selectedIndex = getParameterByName('S3');
  }

  // Set all options to a valid state
  for (i=0; i<document.forms['bgvram'].length; i++)
  {
    j = document.forms['bgvram'].elements[i];
    if ((j.type == 'select-one') && (j.selectedIndex == -1)) j.selectedIndex = 0;
  }

  // Update
  upd();
}

function bg_alloc_from(bgnum, bgtype, size, maxtiles, mapbase, tilebase)
{
  var i, j, sz, sz_t, sz_m, bgcstatus;
  bgnum *= 2;

  if (bgtype == 0) return;
  if (bgtype == 1)
  {
    // BgType_Text8bpp
    sz_t = maxtiles / 32;
    sz = Math.ceil(sz_t);
    for (i=0; i<sz; i++)
    {
      j = (DISPCNT_TileBase * 32) + (tilebase * 8) + i;
      if (j >= 256) j = 256;
      if (j >= 0) VRAM_BGMapping[bgnum][j] = 1;
      if (j > MaxAllocated) MaxAllocated = j;
    }

    sz_m = BGType_TSiz[size];
    sz = Math.ceil(sz_m);
    for (i=0; i<sz; i++)
    {
      j = (DISPCNT_MapBase * 32) + mapbase + i;
      if (j >= 256) j = 256;
      if (j >= 0) VRAM_BGMapping[bgnum+1][j] = 1;
      if (j > MaxAllocated) MaxAllocated = j;
    }
  }
  else if (bgtype == 2)
  {
    // BgType_Text4bpp
    sz_t = maxtiles / 64;
    sz = Math.ceil(sz_t);
    for (i=0; i<sz; i++)
    {
      j = (DISPCNT_TileBase * 32) + (tilebase * 8) + i;
      if (j >= 256) j = 256;
      if (j >= 0) VRAM_BGMapping[bgnum][j] = 1;
      if (j > MaxAllocated) MaxAllocated = j;
    }

    sz_m = BGType_TSiz[size];
    sz = Math.ceil(sz_m);
    for (i=0; i<sz; i++)
    {
      j = (DISPCNT_MapBase * 32) + mapbase + i;
      if (j >= 256) j = 256;
      if (j >= 0) VRAM_BGMapping[bgnum+1][j] = 1;
      if (j > MaxAllocated) MaxAllocated = j;
    }
  }
  else if (bgtype == 3)
  {
    // BgType_Rotation
    sz_t = maxtiles / 32;
    sz = Math.ceil(sz_t);
    for (i=0; i<sz; i++)
    {
      j = (DISPCNT_TileBase * 32) + (tilebase * 8) + i;
      if (j >= 256) j = 256;
      if (j >= 0) VRAM_BGMapping[bgnum][j] = 1;
      if (j > MaxAllocated) MaxAllocated = j;
    }

    sz_m = BGType_RSiz[size];
    sz = Math.ceil(sz_m);
    for (i=0; i<sz; i++)
    {
      j = (DISPCNT_MapBase * 32) + mapbase + i;
      if (j >= 256) j = 256;
      if (j >= 0) VRAM_BGMapping[bgnum+1][j] = 1;
      if (j > MaxAllocated) MaxAllocated = j;
    }
  }
  else if (bgtype == 4)
  {
    // BgType_ExRotation
    sz_t = maxtiles / 32;
    sz = Math.ceil(sz_t);
    for (i=0; i<sz; i++)
    {
      j = (DISPCNT_TileBase * 32) + (tilebase * 8) + i;
      if (j >= 256) j = 256;
      if (j >= 0) VRAM_BGMapping[bgnum][j] = 1;
      if (j > MaxAllocated) MaxAllocated = j;
    }

    sz_m = BGType_ERSiz[size];
    sz = Math.ceil(sz_m);
    for (i=0; i<sz; i++)
    {
      j = (DISPCNT_MapBase * 32) + mapbase + i;
      if (j >= 256) j = 256;
      if (j >= 0) VRAM_BGMapping[bgnum+1][j] = 1;
      if (j > MaxAllocated) MaxAllocated = j;
    }
  }
  else if (bgtype == 5)
  {
    // BgType_Bmp8
    sz_t = BGType_B8Siz[size];
    sz = Math.ceil(sz_t);
    for (i=0; i<sz; i++)
    {
      j = (mapbase * 8) + i;
      if (j >= 256) j = 256;
      if (j >= 0) VRAM_BGMapping[bgnum][j] = 2;
      if (j > MaxAllocated) MaxAllocated = j;
    }

    sz_m = 0;
  }
  else if (bgtype == 6)
  {
    // BgType_Bmp16
    sz_t = BGType_B16Siz[size];
    sz = Math.ceil(sz_t);
    for (i=0; i<sz; i++)
    {
      j = (mapbase * 8) + i;
      if (j >= 256) j = 256;
      if (j >= 0) VRAM_BGMapping[bgnum][j] = 2;
      if (j > MaxAllocated) MaxAllocated = j;
    }

    sz_m = 0;
  }
  VRAM_BGSpace[bgnum] = sz_t * 2;
  VRAM_BGSpace[bgnum+1] = sz_m * 2;
}

function bg_alloc_conflict()
{
  var i, j, bg, numweight;
  var ret = 1;
  for (i=0; i<256; i++)
  {
    VRAM_BGError[i] = 0;
    numweight = 0;

    // Mark weight
    for (bg=0; bg<8; bg+=2)
    {
      if (SubEngine && (i >= 64) && (VRAM_BGMapping[bg][i] != 0)) numweight += 4;
      if (VRAM_BGMapping[bg+1][i] != 0) numweight += 4;
      if (VRAM_BGMapping[bg][i] == 1) numweight++;
      if (VRAM_BGMapping[bg][i] >= 2) numweight += (numweight == 0) ? 1 : 4;
    }

    // Mark warnings
    if ((numweight >= 2) && (numweight < 5))
    {
      for (bg=0; bg<8; bg+=2)
      {
        if (VRAM_BGMapping[bg][i] > 0)
        {
          VRAM_BGMapping[bg][i] = 3;
          ret = 2;
        }
      }
    }

    // Mark errors
    if (numweight >= 5)
    {
      for (bg=0; bg<8; bg+=2)
      {
        if (VRAM_BGMapping[bg][i] > 0) VRAM_BGMapping[bg][i] = 4;
        if (VRAM_BGMapping[bg+1][i] > 0) VRAM_BGMapping[bg+1][i] = 4;
      }
      VRAM_BGError[i] = 1;
      ret = 3;
    }

    // Mark out of range for sub-engine
    if (SubEngine && (i >= 64))
    {
      for (bg=0; bg<8; bg++)
      {
        if (VRAM_BGMapping[bg][i] > 0)
        {
          VRAM_BGMapping[bg][i] = 6;
          VRAM_BGError[i] = 1;
          ret = 3;
        }
        else
          VRAM_BGMapping[bg][i] = 5;
      }
    }
  }

  VRAM_BGError[256] = 0;
  for (bg=0; bg<8; bg++)
  {
    if (VRAM_BGMapping[bg][256] > 0)
    {
      // Mark out of range
      VRAM_BGError[256] = 1;
      ret = 4;
    }
  }
  return ret;
}

function bg_allocation()
{
  var i, sz, szopt, maxtiles, mapbase, tilebase;
  var bgtype0, bgtype1, bgtype2, bgtype3;
  var wmode, a, b;
  var bgcodesnippet = "";
  var largebitmap = false;

  // Set DISPCNT offsets
  SubEngine = document.forms['bgvram'].SubEngine.checked;
  if (SubEngine)
  {
    ShareLink += "&SUB=1";
    document.forms['bgvram'].MS.options.selectedIndex = 0;
    DISPCNT_MapBase = 0;
    document.forms['bgvram'].TS.options.selectedIndex = 0;
    DISPCNT_TileBase = 0;
    document.forms['bgvram'].MS.disabled = true;
    document.forms['bgvram'].TS.disabled = true;
  }
  else
  {
    DISPCNT_MapBase = document.forms['bgvram'].MS.options.selectedIndex;
    if (DISPCNT_MapBase != 0) ShareLink += "&MS=" + DISPCNT_MapBase;
    DISPCNT_TileBase = document.forms['bgvram'].TS.options.selectedIndex;
    if (DISPCNT_TileBase != 0) ShareLink += "&TS=" + DISPCNT_TileBase;
    document.forms['bgvram'].MS.disabled = false;
    document.forms['bgvram'].TS.disabled = false;
  }

  // Setup array
  for (i=0; i<257; i++)
  {
    VRAM_BGMapping[0][i] = 0;
    VRAM_BGMapping[1][i] = 0;
    VRAM_BGMapping[2][i] = 0;
    VRAM_BGMapping[3][i] = 0;
    VRAM_BGMapping[4][i] = 0;
    VRAM_BGMapping[5][i] = 0;
    VRAM_BGMapping[6][i] = 0;
    VRAM_BGMapping[7][i] = 0;
  }
  for (i=0; i<8; i++) VRAM_BGSpace[i] = 0;

  // Show/Hide controls
  i = document.forms['bgvram'].T0.options.selectedIndex;
  if (i > 0)
  {
    document.getElementById('BG_TS0').style.display = "";
    document.getElementById('BG_NT0').style.display = "";
    document.getElementById('BG_MB0').style.display = "";
    document.getElementById('BG_TB0').style.display = "";
  }
  else
  {
    document.getElementById('BG_TS0').style.display = "none";
    document.getElementById('BG_NT0').style.display = "none";
    document.getElementById('BG_MB0').style.display = "none";
    document.getElementById('BG_TB0').style.display = "none";
  }
  i = document.forms['bgvram'].T1.options.selectedIndex;
  if (i > 0)
  {
    document.getElementById('BG_TS1').style.display = "";
    document.getElementById('BG_NT1').style.display = "";
    document.getElementById('BG_MB1').style.display = "";
    document.getElementById('BG_TB1').style.display = "";
  }
  else
  {
    document.getElementById('BG_TS1').style.display = "none";
    document.getElementById('BG_NT1').style.display = "none";
    document.getElementById('BG_MB1').style.display = "none";
    document.getElementById('BG_TB1').style.display = "none";
  }
  i = document.forms['bgvram'].T2.options.selectedIndex;
  if (i > 0)
  {
    document.getElementById('BG_TS2').style.display = (i < 3) ? "" : "none";
    document.getElementById('BG_RS2').style.display = (i == 3) ? "" : "none";
    document.getElementById('BG_ERS2').style.display = (i == 4) ? "" : "none";
    document.getElementById('BG_B8S2').style.display = (i == 5) ? "" : "none";
    document.getElementById('BG_B16S2').style.display = (i == 6) ? "" : "none";
    document.getElementById('BG_NT2').style.display = ((i != 3) && (i < 5)) ? "" : "none";
    document.getElementById('BG_RNT2').style.display = (i == 3) ? "" : "none";
    document.getElementById('BG_MB2').style.display = "";
    document.getElementById('BG_TB2').style.display = (i < 5) ? "" : "none";
  }
  else
  {
    document.getElementById('BG_TS2').style.display = "none";
    document.getElementById('BG_RS2').style.display = "none";
    document.getElementById('BG_ERS2').style.display = "none";
    document.getElementById('BG_B8S2').style.display = "none";
    document.getElementById('BG_B16S2').style.display = "none";
    document.getElementById('BG_NT2').style.display = "none";
    document.getElementById('BG_RNT2').style.display = "none";
    document.getElementById('BG_MB2').style.display = "none";
    document.getElementById('BG_TB2').style.display = "none";
  }
  i = document.forms['bgvram'].T3.options.selectedIndex;
  if (i > 0)
  {
    document.getElementById('BG_TS3').style.display = (i < 3) ? "" : "none";
    document.getElementById('BG_RS3').style.display = (i == 3) ? "" : "none";
    document.getElementById('BG_ERS3').style.display = (i == 4) ? "" : "none";
    document.getElementById('BG_B8S3').style.display = (i == 5) ? "" : "none";
    document.getElementById('BG_B16S3').style.display = (i == 6) ? "" : "none";
    document.getElementById('BG_NT3').style.display = ((i != 3) && (i < 5)) ? "" : "none";
    document.getElementById('BG_RNT3').style.display = (i == 3) ? "" : "none";
    document.getElementById('BG_MB3').style.display = "";
    document.getElementById('BG_TB3').style.display = (i < 5) ? "" : "none";
  }
  else
  {
    document.getElementById('BG_TS3').style.display = "none";
    document.getElementById('BG_RS3').style.display = "none";
    document.getElementById('BG_ERS3').style.display = "none";
    document.getElementById('BG_B8S3').style.display = "none";
    document.getElementById('BG_B16S3').style.display = "none";
    document.getElementById('BG_NT3').style.display = "none";
    document.getElementById('BG_RNT3').style.display = "none";
    document.getElementById('BG_MB3').style.display = "none";
    document.getElementById('BG_TB3').style.display = "none";
  }

  // Map BG 0
  bgtype0 = document.forms['bgvram'].T0.options.selectedIndex;
  maxtiles = document.forms['bgvram'].NT0.options[document.forms['bgvram'].NT0.options.selectedIndex].value;
  mapbase = document.forms['bgvram'].MB0.options.selectedIndex;
  tilebase = document.forms['bgvram'].TB0.options.selectedIndex;
  if (bgtype0 > 0)
  {
    ShareLink += "&T0=" + bgtype0 + "&NT0=" + maxtiles + "&MB0=" + mapbase + "&TB0=" + tilebase;
  }
  switch (bgtype0)
  {
  case 0: {
      sz = 0;
      document.getElementById('BG_DESC0').innerHTML = "* Background is unused";
    } break;
  case 1: {
      sz = document.forms['bgvram'].TS0.options.selectedIndex;
      szopt = document.forms['bgvram'].TS0.options;
      document.getElementById('BG_DESC0').innerHTML = "* 256 colors tiles<br />* 16 Extended Palettes";
    } break;
  case 2: {
      sz = document.forms['bgvram'].TS0.options.selectedIndex;
      szopt = document.forms['bgvram'].TS0.options;
      document.getElementById('BG_DESC0').innerHTML = "* 16 colors tiles<br />* 16 Palettes";
    } break;
  }
  if (bgtype0 > 0)
  {
    ShareLink += "&S0=" + sz;
    bgcodesnippet += "<span class='func'>bgInit" + (SubEngine ? "Sub" : "") + "</span>(<span class='numm'>0</span>";
    bgcodesnippet += ", <span class='deff'>BgType_" + document.forms['bgvram'].T0.options[document.forms['bgvram'].T0.options.selectedIndex].value + "</span>";
    bgcodesnippet += ", <span class='deff'>BgSize_" + szopt[szopt.selectedIndex].value + "</span>";
    bgcodesnippet += ", <span class='numm'>" + mapbase + "</span>, <span class='numm'>" + tilebase + "</span>);<br />";
  }
  bg_alloc_from(0, bgtype0, sz, maxtiles, mapbase, tilebase);

  // Map BG 1
  bgtype1 = document.forms['bgvram'].T1.options.selectedIndex;
  maxtiles = document.forms['bgvram'].NT1.options[document.forms['bgvram'].NT1.options.selectedIndex].value;
  mapbase = document.forms['bgvram'].MB1.options.selectedIndex;
  tilebase = document.forms['bgvram'].TB1.options.selectedIndex;
  if (bgtype1 > 0)
  {
    ShareLink += "&T1=" + bgtype1 + "&NT1=" + maxtiles + "&MB1=" + mapbase + "&TB1=" + tilebase;
  }
  switch (bgtype1)
  {
  case 0: {
      sz = 0;
      document.getElementById('BG_DESC1').innerHTML = "* Background is unused";
    } break;
  case 1: {
      sz = document.forms['bgvram'].TS1.options.selectedIndex;
      szopt = document.forms['bgvram'].TS1.options;
      document.getElementById('BG_DESC1').innerHTML = "* 256 colors tiles<br />* 16 Extended Palettes";
    } break;
  case 2: {
      sz = document.forms['bgvram'].TS1.options.selectedIndex;
      szopt = document.forms['bgvram'].TS1.options;
      document.getElementById('BG_DESC1').innerHTML = "* 16 colors tiles<br />* 16 Palettes";
    } break;
  }
  if (bgtype1 > 0)
  {
    ShareLink += "&S1=" + sz;
    bgcodesnippet += "<span class='func'>bgInit" + (SubEngine ? "Sub" : "") + "</span>(<span class='numm'>1</span>";
    bgcodesnippet += ", <span class='deff'>BgType_" + document.forms['bgvram'].T1.options[document.forms['bgvram'].T1.options.selectedIndex].value + "</span>";
    bgcodesnippet += ", <span class='deff'>BgSize_" + szopt[szopt.selectedIndex].value + "</span>";
    bgcodesnippet += ", <span class='numm'>" + mapbase + "</span>, <span class='numm'>" + tilebase + "</span>);<br />";
  }
  bg_alloc_from(1, bgtype1, sz, maxtiles, mapbase, tilebase);

  // Map BG 2
  bgtype2 = document.forms['bgvram'].T2.options.selectedIndex;
  if (bgtype2 == 3)
    maxtiles = document.forms['bgvram'].RNT2.options[document.forms['bgvram'].RNT2.options.selectedIndex].value;
  else
    maxtiles = document.forms['bgvram'].NT2.options[document.forms['bgvram'].NT2.options.selectedIndex].value;
  mapbase = document.forms['bgvram'].MB2.options.selectedIndex;
  tilebase = document.forms['bgvram'].TB2.options.selectedIndex;
  if (bgtype2 > 0)
  {
    ShareLink += "&T2=" + bgtype2 + "&NT2=" + maxtiles + "&MB2=" + mapbase + "&TB2=" + tilebase;
  }
  document.getElementById('BG_MB2Txt').innerHTML = "Map Base";
  switch (bgtype2)
  {
  case 0: {
      sz = 0;
      document.getElementById('BG_DESC2').innerHTML = "* Background is unused";
    } break;
  case 1: {
      sz = document.forms['bgvram'].TS2.options.selectedIndex;
      szopt = document.forms['bgvram'].TS2.options;
      document.getElementById('BG_DESC2').innerHTML = "* 256 colors tiles<br />* 16 Extended Palettes";
    } break;
  case 2: {
      sz = document.forms['bgvram'].TS2.options.selectedIndex;
      szopt = document.forms['bgvram'].TS2.options;
      document.getElementById('BG_DESC2').innerHTML = "* 16 colors tiles<br />* 16 Palettes";
    } break;
  case 3: {
      sz = document.forms['bgvram'].RS2.options.selectedIndex;
      szopt = document.forms['bgvram'].RS2.options;
      document.getElementById('BG_DESC2').innerHTML = "* 256 colors tiles<br />* Can't flip tiles<br />* Maximum of 256 tiles";
    } break;
  case 4: {
      sz = document.forms['bgvram'].ERS2.options.selectedIndex;
      szopt = document.forms['bgvram'].ERS2.options;
      document.getElementById('BG_DESC2').innerHTML = "* 256 colors tiles<br />* 16 Extended Palettes";
    } break;
  case 5: {
      sz = document.forms['bgvram'].B8S2.options.selectedIndex;
      szopt = document.forms['bgvram'].B8S2.options;
      document.getElementById('BG_DESC2').innerHTML = "* 256 colors bitmap<br />Note1: Refer to BgSize_B8_256x256 but<br />only the top 256x192 is used.";
      document.getElementById('BG_MB2Txt').innerHTML = "BMP Map Base";
    } break;
  case 6: {
      sz = document.forms['bgvram'].B16S2.options.selectedIndex;
      szopt = document.forms['bgvram'].B16S2.options;
      document.getElementById('BG_DESC2').innerHTML = "* 32768 colors bitmap (+ 1-Bit Alpha)<br />Note1: Refer to BgSize_B8_256x256 but<br />only the top 256x192 is used.";
      document.getElementById('BG_MB2Txt').innerHTML = "BMP Map Base";
    } break;
  }
  if (bgtype2 > 0)
  {
    ShareLink += "&S2=" + sz;
    bgcodesnippet += "<span class='func'>bgInit" + (SubEngine ? "Sub" : "") + "</span>(<span class='numm'>2</span>";
    bgcodesnippet += ", <span class='deff'>BgType_" + document.forms['bgvram'].T2.options[document.forms['bgvram'].T2.options.selectedIndex].value + "</span>";
    if (szopt[szopt.selectedIndex].value == 'B8_256x192')
      bgcodesnippet += ", <span class='deff'>BgSize_B8_256x256</span>";
    else if (szopt[szopt.selectedIndex].value == 'B16_256x192')
      bgcodesnippet += ", <span class='deff'>BgSize_B16_256x256</span>";
    else
      bgcodesnippet += ", <span class='deff'>BgSize_" + szopt[szopt.selectedIndex].value + "</span>";
    bgcodesnippet += ", <span class='numm'>" + mapbase + "</span>, <span class='numm'>" + tilebase + "</span>);<br />";
    if ((szopt[szopt.selectedIndex].value == 'B8_512x1024') || (szopt[szopt.selectedIndex].value == 'B8_1024x512')) largebitmap = true;
    if (SubEngine && largebitmap) bgcodesnippet += "<span class='comm'>// Error! Large bitmap isn't supported on Sub Engine</span>";
  }
  bg_alloc_from(2, bgtype2, sz, maxtiles, mapbase, tilebase);

  // Map BG 3
  bgtype3 = document.forms['bgvram'].T3.options.selectedIndex;
  if (bgtype3 == 3)
    maxtiles = document.forms['bgvram'].RNT3.options[document.forms['bgvram'].RNT3.options.selectedIndex].value;
  else
    maxtiles = document.forms['bgvram'].NT3.options[document.forms['bgvram'].NT3.options.selectedIndex].value;
  mapbase = document.forms['bgvram'].MB3.options.selectedIndex;
  tilebase = document.forms['bgvram'].TB3.options.selectedIndex;
  if (bgtype3 > 0)
  {
    ShareLink += "&T3=" + bgtype3 + "&NT3=" + maxtiles + "&MB3=" + mapbase + "&TB3=" + tilebase;
  }
  document.getElementById('BG_MB3Txt').innerHTML = "Map Base";
  switch (bgtype3)
  {
  case 0: {
      sz = 0;
      document.getElementById('BG_DESC3').innerHTML = "* Background is unused";
    } break;
  case 1: {
      sz = document.forms['bgvram'].TS3.options.selectedIndex;
      szopt = document.forms['bgvram'].TS3.options;
      document.getElementById('BG_DESC3').innerHTML = "* 256 colors tiles<br />* 16 Extended Palettes";
    } break;
  case 2: {
      sz = document.forms['bgvram'].TS3.options.selectedIndex;
      szopt = document.forms['bgvram'].TS3.options;
      document.getElementById('BG_DESC3').innerHTML = "* 16 colors tiles<br />* 16 Palettes";
    } break;
  case 3: {
      sz = document.forms['bgvram'].RS3.options.selectedIndex;
      szopt = document.forms['bgvram'].RS3.options;
      document.getElementById('BG_DESC3').innerHTML = "* 256 colors tiles<br />* Can't flip tiles<br />* Maximum of 256 tiles";
    } break;
  case 4: {
      sz = document.forms['bgvram'].ERS3.options.selectedIndex;
      szopt = document.forms['bgvram'].ERS3.options;
      document.getElementById('BG_DESC3').innerHTML = "* 256 colors tiles<br />* 16 Extended Palettes";
    } break;
  case 5: {
      sz = document.forms['bgvram'].B8S3.options.selectedIndex;
      szopt = document.forms['bgvram'].B8S3.options;
      document.getElementById('BG_DESC3').innerHTML = "* 256 colors bitmap<br />Note1: Refer to BgSize_B8_256x256 but<br />only the top 256x192 is used.";
      document.getElementById('BG_MB3Txt').innerHTML = "BMP Map Base";
    } break;
  case 6: {
      sz = document.forms['bgvram'].B16S3.options.selectedIndex;
      szopt = document.forms['bgvram'].B16S3.options;
      document.getElementById('BG_DESC3').innerHTML = "* 32768 colors bitmap (+ 1-Bit Alpha)<br />Note1: Refer to BgSize_B8_256x256 but<br />only the top 256x192 is used.";
      document.getElementById('BG_MB3Txt').innerHTML = "BMP Map Base";
    } break;
  }
  if (bgtype3 > 0)
  {
    ShareLink += "&S3=" + sz;
    bgcodesnippet += "<span class='func'>bgInit" + (SubEngine ? "Sub" : "") + "</span>(<span class='numm'>3</span>";
    bgcodesnippet += ", <span class='deff'>BgType_" + document.forms['bgvram'].T3.options[document.forms['bgvram'].T3.options.selectedIndex].value + "</span>";
    if (szopt[szopt.selectedIndex].value == 'B8_256x192')
      bgcodesnippet += ", <span class='deff'>BgSize_B8_256x256</span>";
    else if (szopt[szopt.selectedIndex].value == 'B16_256x192')
      bgcodesnippet += ", <span class='deff'>BgSize_B16_256x256</span>";
    else
      bgcodesnippet += ", <span class='deff'>BgSize_" + szopt[szopt.selectedIndex].value + "</span>";
    bgcodesnippet += ", <span class='numm'>" + mapbase + "</span>, <span class='numm'>" + tilebase + "</span>);<br />";
  }
  bg_alloc_from(3, bgtype3, sz, maxtiles, mapbase, tilebase);

  // Check for conflicts
  bgcstatus = bg_alloc_conflict();

  // Write results
  if (bgtype0 > 0)
    document.getElementById('BG0_Usage').innerHTML = "Background 0: Using <b>" + V2Digits(VRAM_BGSpace[0]) + "KB</b> for gfx and <b>" + V2Digits(VRAM_BGSpace[1]) + "KB</b> for map.";
  else
    document.getElementById('BG0_Usage').innerHTML = "Background 0: Not being used.";
  if (bgtype1 > 0)
    document.getElementById('BG1_Usage').innerHTML = "Background 1: Using <b>" + V2Digits(VRAM_BGSpace[2]) + "KB</b> for gfx and <b>" + V2Digits(VRAM_BGSpace[3]) + "KB</b> for map.";
  else
    document.getElementById('BG1_Usage').innerHTML = "Background 1: Not being used.";
  if (bgtype2 > 0)
    document.getElementById('BG2_Usage').innerHTML = "Background 2: Using <b>" + V2Digits(VRAM_BGSpace[4]) + "KB</b> for gfx and <b>" + V2Digits(VRAM_BGSpace[5]) + "KB</b> for map.";
  else
    document.getElementById('BG2_Usage').innerHTML = "Background 2: Not being used.";
  if (bgtype3 > 0)
    document.getElementById('BG3_Usage').innerHTML = "Background 3: Using <b>" + V2Digits(VRAM_BGSpace[6]) + "KB</b> for gfx and <b>" + V2Digits(VRAM_BGSpace[7]) + "KB</b> for map.";
  else
    document.getElementById('BG3_Usage').innerHTML = "Background 3: Not being used.";

  switch (bgcstatus)
  {
    case 1: document.getElementById('Mapping_Status').innerHTML = "VRAM BG Allocation okay!"; break;
    case 2: document.getElementById('Mapping_Status').innerHTML = "<b>Warning:</b> VRAM BG Allocation has some warnings, ignore if gfx has shared tileset graphics."; break;
    case 3: document.getElementById('Mapping_Status').innerHTML = "<b>Error:</b> VRAM BG Allocation has errors."; break;
    case 4: document.getElementById('Mapping_Status').innerHTML = "<b>Error:</b> VRAM BG Allocation is outside the range."; break;
  }

  // Get a working mode out of a list of combinations
  wmode = WorkModes[bgtype3 + bgtype2*8];
  if (largebitmap)
  {
    if ((bgtype0 == 0) && (bgtype1 == 0) && (bgtype3 == 0))
      wmode = 6;
    else
      wmode = -1;
  }

  // Generate report
  if (wmode < 0)
  {
    document.getElementById('Recommended_Mode').innerHTML = "<b>Error:</b> Invalid background type combination!";
    document.getElementById('Working_Engines').innerHTML = "<b>Error:</b> Combination won't work on hardware!";
  }
  else if (MaxAllocated >= 256)
  {
    document.getElementById('Recommended_Mode').innerHTML = "<b>Mode " + wmode + "</b> will support your options.";
    document.getElementById('Working_Engines').innerHTML = "<b>Error:</b> Graphics out of range!";
  }
  else
  {
    document.getElementById('Recommended_Mode').innerHTML = "<b>Mode " + wmode + "</b> will support your options.";
    if (SubEngine && largebitmap)
    {
      document.getElementById('Recommended_Mode').innerHTML = "<b>Error:</b> Sub Engine don't support large bitmaps.";
      document.getElementById('Working_Engines').innerHTML = "<b>Error:</b> Combination won't work on hardware!";
      wmode = -1;
    }
    else if ((DISPCNT_MapBase == 0) && (DISPCNT_TileBase == 0) && (!largebitmap) && (MaxAllocated < 64))
      document.getElementById('Working_Engines').innerHTML = "Works for Main Engine or Sub Engine.";
    else
      if (MaxAllocated >= 64)
        document.getElementById('Working_Engines').innerHTML = "Works for Main Engine only!<br />For Sub Engine map, don't use more than 128KB.";
      else if (largebitmap)
        document.getElementById('Working_Engines').innerHTML = "Works for Main Engine only!<br />For Sub Engine map, don't use large bitmap.";
      else
        document.getElementById('Working_Engines').innerHTML = "Works for Main Engine only!<br />For Sub Engine map, use DISPCNT 64KB steps of 0.";
  }

  if ((wmode >= 0) && (bgcstatus < 3))
  {
    document.getElementById('Report').innerHTML = "All options valid.";
    document.getElementById('Report').style.color = "#00A000";
  }
  else
  {
    document.getElementById('Report').innerHTML = "Found errors/conflicts.";
    document.getElementById('Report').style.color = "#C00000";
  }

  // Generate function calls
  if ((wmode < 0) || (bgcstatus >= 3))
    Function_Call += "<span class='comm'>// Error(s) found<br />";
  else
  {
    Function_Call += "<span class='func'>videoSetMode" + (SubEngine ? "Sub" : "") + "</span>(<span class='deff'>MODE_" + wmode + "_2D</span>";
    if (DISPCNT_MapBase != 0) Function_Call += " | <span class='deff'>DISPLAY_SCREEN_BASE(" + DISPCNT_MapBase + ")</span>";
    if (DISPCNT_TileBase != 0) Function_Call += " | <span class='deff'>DISPLAY_CHAR_BASE(" + DISPCNT_TileBase + ")</span>";
    Function_Call += ");<br />";
    if (bgcodesnippet.length > 0) Function_Call += "<br />";
    Function_Call += bgcodesnippet;
  }
}

function bg_allocation_table()
{
  var tableid, table, tr, td, i, j, k;
  tableid = document.getElementById('BGAllocationTable');
  tableid.innerHTML = "";
  table = document.createElement('TABLE');
  tr = document.createElement('TR');
  tr.innerHTML = "<td rowspan=2>BMP Map<br />(16KB)</td><td rowspan=2>Tile Base<br />(16KB)</td><td rowspan=2>Map Base<br />(2KB)</td><td rowspan=2>Address</td><td colspan=2>BG0</td><td colspan=2>BG1</td><td colspan=2>BG2</td><td colspan=3>BG3</td>";
  table.appendChild(tr);
  tr = document.createElement('TR');
  tr.innerHTML = "<td>Gfx</td><td>Map</td><td>Gfx</td><td>Map</td><td>Gfx</td><td>Map</td><td>Gfx</td><td>Map</td>";
  table.appendChild(tr);
  for (i=0; i<256; i++)
  {
    tr = document.createElement('TR');

    // Boundary
    if (((i % 64) == 0) && (i != 0))
    {
      tr.innerHTML = "<td colspan='12'>" + (i*2) + "KB Boundary</td>";
      table.appendChild(tr);
      tr = document.createElement('TR');
    }

    // Bitmap Base
    if ((i % 8) == 0)
    {
      j = (i / 8);
      td = document.createElement('TD');
      for (k=0; k<8; k++) if (VRAM_BGError[i+k]) td.style.backgroundColor = "#DFAFAF";
      td.innerHTML = j;
      td.rowSpan = 8;
      tr.appendChild(td);
    }

    // Tile Base
    if ((i % 8) == 0)
    {
      j = -(DISPCNT_TileBase * 4) + (i / 8);
      td = document.createElement('TD');
      for (k=0; k<8; k++) if (VRAM_BGError[i+k]) td.style.backgroundColor = "#DFAFAF";
      if ((j >= 0) && (j < 16))
      {
        td.innerHTML = j;
      }
      else
        td.innerHTML = "N/A";
      td.rowSpan = 8;
      tr.appendChild(td);
    }

    // Map Base
    j = -(DISPCNT_MapBase * 32) + i;
    td = document.createElement('TD');
    if (VRAM_BGError[i]) td.style.backgroundColor = "#DFAFAF";
    if ((j >= 0) && (j < 32))
      td.innerHTML = j;
    else
      td.innerHTML = "N/A";
    tr.appendChild(td);

    // Address Base
    td = document.createElement('TD');
    if (VRAM_BGError[i]) td.style.backgroundColor = "#DFAFAF";
    td.innerHTML = "0x0" + (0x06000000 + i * 0x800).toString(16).toUpperCase();
    tr.appendChild(td);

    // Mark cells
    for (j=0; j<8; j++)
    {
      td = document.createElement('TD');
      td.style.backgroundColor = ColorCode[VRAM_BGMapping[j][i]];
      tr.appendChild(td);
    }

    table.appendChild(tr);
  }

  // Last boundary
  tr = document.createElement('TR');
  tr.innerHTML = "<td colspan='12'>" + (i*2) + "KB Boundary</td>";

  table.appendChild(tr);

  // Out of range cells
  tr = document.createElement('TR');
  td = document.createElement('TD');
  td.innerHTML = "Out of range";
  td.colSpan = 4;
  tr.appendChild(td);
  if (VRAM_BGError[256]) td.style.backgroundColor = "#DFAFAF";
  for (j=0; j<8; j++)
  {
    td = document.createElement('TD');
    if (VRAM_BGMapping[j][256] == 0)
      td.style.backgroundColor = ColorCode[5];
    else
      td.style.backgroundColor = ColorCode[6];
    tr.appendChild(td);
  }
  table.appendChild(tr);

  // Add table
  tableid.appendChild(table);
}

function upd()
{
  var i, a, b;

  // Clear globals
  ShareLink = "";
  Function_Call = "";
  CPU_Access = "";
  MaxAllocated = 0;

  // Update BG allocation
  bg_allocation();

  // Generate BG allocation table
  bg_allocation_table();

  // Update globals
  ShareLink = "#" + ShareLink.substring(1);
  document.getElementById('ShareLink').innerHTML = "<a href=" + ShareLink + ">" + ShareLink + "</a>";
  document.getElementById('FunctionCall').innerHTML = Function_Call;
  window.location.hash = ShareLink;
}
