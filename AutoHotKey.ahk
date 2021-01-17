; # 代表 Win 
; ! 代表 Alt
; ^ 代表 Ctrl
; + 代表 Shift

; 按下 ctrl + b 时触发
^b::
RunWait, markdown-image-tool.exe, , Hide
Send ^v
Return