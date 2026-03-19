# claude
claudeファイル

## 通知機能

Claudeの作業完了時・承認待ち時にmacOSの通知を送るhookです。

### 必要なツール

**terminal-notifier**

macOS通知の送信に使用します。

```bash
brew install terminal-notifier
```

**Cursor**

通知クリック時に対象のworktreeをCursorで開きます。`/usr/local/bin/cursor` にCLIが存在する必要があります。

Cursorを起動し、コマンドパレット（Cmd+Shift+P）から `Shell Command: Install 'cursor' command in PATH` を実行してインストールしてください。
