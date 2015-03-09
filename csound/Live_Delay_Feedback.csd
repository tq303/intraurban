<CsoundSynthesizer>
<CsOptions>
-odac
</CsOptions>
<CsInstruments>

/*****LIVE DEALY AND FEEDBACK*****/
;example for CsoundQt
;written by joachim heintz
;may 2011
;please send bug reports and suggestions
;to jh at joachimheintz.de

sr = 44100
ksmps = 32
nchnls = 2
0dbfs = 1


  opcode	ShowLED_a, 0, Sakkk
;shows an audiosignal in an outvalue channel, in dB or raw amplitudes
;Soutchan: string as name of the outvalue channel
;asig: audio signal to be shown
;kdispfreq: refresh frequency of the display (Hz)
;kdb: 1 = show as db, 0 = show as raw amplitudes (both in the range 0-1)
;kdbrange: if idb=1: which dB range is shown
Soutchan, asig, ktrig, kdb, kdbrange	xin
kdispval	max_k	asig, ktrig, 1
	if kdb != 0 then
kdb 		= 		dbfsamp(kdispval)
kval 		= 		(kdbrange + kdb) / kdbrange
	else
kval		=		kdispval
	endif
	if ktrig == 1 then
		outvalue	Soutchan, kval
	endif
  endop

  opcode ShowOver_a, 0, Sakk
;shows if asig has been larger than 1 and stays khold seconds
;Soutchan: string as name of the outvalue channel
;kdispfreq: refresh frequency of the display (Hz)
Soutchan, asig, ktrig, khold	xin
kon		init		0
ktim		times
kstart		init		0
kend		init		0
khold		=		(khold < .01 ? .01 : khold); avoiding too short hold times
kmax		max_k		asig, ktrig, 1
	if kon == 0 && kmax > 1 && ktrig == 1 then
kstart		=		ktim
kend		=		kstart + khold
		outvalue	Soutchan, kmax
kon		=		1
	endif
	if kon == 1 && ktim > kend && ktrig == 1 then
		outvalue	Soutchan, 0
kon		=		0
	endif
  endop


instr 1; master instrument
;;set maximum delay
imaxdel	=		10
;;get live input 
kinchnl	invalue	"inchnl"
aLiveInPre	inch		kinchnl
kingaindb	invalue	"ingaindb"
kLiveInGain	=		ampdb(kingaindb)
aLiveInPost	=		aLiveInPre * kLiveInGain


;;show live input
gkTrigDisp	metro		10
gkshowdb	invalue	"showdb"
gkdbrange	invalue	"dbrange"
		ShowLED_a	"LiveInPre", aLiveInPre, gkTrigDisp, gkshowdb, gkdbrange
		ShowOver_a	"LiveInPreOver", aLiveInPre, gkTrigDisp, 2
		ShowLED_a	"LiveInPost", aLiveInPost, gkTrigDisp, gkshowdb, gkdbrange
		ShowOver_a	"LiveInPostOver", aLiveInPost, gkTrigDisp, 2

;;delay and feedback amount
kdeltim	invalue	"deltim" ;delay time in seconds
kfbamnt	invalue	"fbamnt" ;feedback amount 0-1
adeltim	=		kdeltim
adel		init		0
adelin		=		aLiveInPost + adel * kfbamnt
adel		vdelay3	adelin, adeltim*1000, imaxdel*1000

;;mix and output
kmix		invalue	"mix"
koutgaindb	invalue	"outgaindb"
kgain		=		ampdb(koutgaindb)
amix		=		adel * kmix + aLiveInPost * (1-kmix)
aout		=		amix * kgain
		outch		1, aout, 2, aout

;;show output
		ShowLED_a	"out", aout, gkTrigDisp, gkshowdb, gkdbrange
		ShowOver_a	"outover", aout, gkTrigDisp, 2
endin


</CsInstruments>
<CsScore>
i 1 0 36000
e
</CsScore>
</CsoundSynthesizer>

<bsbPanel>
 <label>Widgets</label>
 <objectName/>
 <x>287</x>
 <y>124</y>
 <width>908</width>
 <height>582</height>
 <visible>true</visible>
 <uuid/>
 <bgcolor mode="background">
  <r>220</r>
  <g>220</g>
  <b>220</b>
 </bgcolor>
</bsbPanel>
<bsbPresets>
</bsbPresets>
<EventPanel name="" tempo="60.00000000" loop="8.00000000" x="360" y="248" width="612" height="322" visible="false" loopStart="0" loopEnd="0">    </EventPanel>
