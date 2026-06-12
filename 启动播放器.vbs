' 无黑框窗口启动个人音乐播放器
' 双击本文件即可用默认浏览器打开 index.html
Dim fso, scriptDir, indexPath, shell
Set fso = CreateObject("Scripting.FileSystemObject")
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
indexPath = fso.BuildPath(scriptDir, "index.html")

If fso.FileExists(indexPath) Then
    Set shell = CreateObject("WScript.Shell")
    shell.Run """" & indexPath & """", 1, False
Else
    MsgBox "找不到 index.html，请确认本脚本与播放器文件在同一文件夹。", 16, "启动失败"
End If
