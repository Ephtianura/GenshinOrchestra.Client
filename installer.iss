#ifndef AppVersion
  #define AppVersion "1.1.0"
#endif

[Setup]
AppName=Genshin Orchestra
AppVersion={#AppVersion}
SetupIconFile="App/icon.ico" 

DefaultDirName={autopf}\GenshinOrchestra
DefaultGroupName=Genshin Orchestra
OutputDir=.\InstallerOutput
OutputBaseFilename=GenshinOrchestra_Setup_v{#AppVersion}

UsePreviousAppDir=yes

PrivilegesRequired=admin
PrivilegesRequiredOverridesAllowed=commandline

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

[InstallDelete]
Type: files; Name: "{app}\*.dll"
Type: files; Name: "{app}\*.exe"
Type: filesandordirs; Name: "{app}\wwwroot\*"

[Run]
Filename: "{app}\Genshin Orchestra.exe"; Description: "{cm:LaunchApp}"; Flags: nowait postinstall skipifsilent runascurrentuser; Check: not WizardSilent
Filename: "{app}\Genshin Orchestra.exe"; Flags: nowait runascurrentuser; Check: IsSilentAndRunRequested

[Code]
function IsSilentAndRunRequested(): Boolean;
var
  I: Integer;
begin
  Result := False;
  if WizardIsTaskSelected('silent') or WizardSilent() then
  begin
    for I := 1 to ParamCount do
    begin
      if CompareText(ParamStr(I), '/RUN') = 0 then
      begin
        Result := True;
        Break;
      end;
    end;
  end;
end;