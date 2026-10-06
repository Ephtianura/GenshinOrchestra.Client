#ifndef AppVersion
  #define AppVersion "0.1.0"
#endif

[Setup]
AppName=Genshin Orchestra
AppVersion={#AppVersion}
SetupIconFile="App/icon.ico" 

DefaultDirName={autopf}\GenshinOrchestra
DefaultGroupName=Genshin Orchestra
OutputDir=.\InstallerOutput
OutputBaseFilename=GenshinOrchestra_Setup_v{#AppVersion}

PrivilegesRequired=admin

Compression=lzma2
SolidCompression=yes

UninstallDisplayIcon="{app}\Genshin Orchestra.exe"

ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64

AppPublisher=Ephtianura
AppPublisherURL="https://github.com/Ephtianura/GenshinOrchestra"

ShowLanguageDialog=yes

WizardStyle=modern


[Languages]
Name: "russian"; MessagesFile: "compiler:Languages\Russian.isl"; LicenseFile: "EULA\EULA_ru.txt"
Name: "english"; MessagesFile: "compiler:Default.isl"; LicenseFile: "EULA\EULA_en.txt"
Name: "ukrainian"; MessagesFile: "compiler:Languages\Ukrainian.isl"; LicenseFile: "EULA\EULA_uk.txt"

[CustomMessages]
russian.CreateDesktopIcon=Создать ярлык на Рабочем столе
english.CreateDesktopIcon=Create a desktop shortcut
ukrainian.CreateDesktopIcon=Створити ярлик на Робочому столі

russian.LaunchApp=Запустить Genshin Orchestra
english.LaunchApp=Launch Genshin Orchestra
ukrainian.LaunchApp=Запустити Genshin Orchestra

[Files]
Source: "published-app\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Icons]
Name: "{autoprograms}\Genshin Orchestra"; Filename: "{app}\Genshin Orchestra.exe"
Name: "{autodesktop}\Genshin Orchestra"; Filename: "{app}\Genshin Orchestra.exe"; Tasks: desktopicon

[Run]
Filename: "{app}\Genshin Orchestra.exe"; Description: "{cm:LaunchApp}"; Flags: nowait postinstall skipifsilent