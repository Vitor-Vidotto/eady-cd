use tauri::{Manager, AppHandle, Emitter};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};

fn synchronize(app: &tauri::AppHandle) {
  // Emite o evento 'cooldown' para todas as webviews
  app.emit("cooldown", None::<()>).expect("Falha ao emitir evento");
  println!("emitido")
}
fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(desktop)]
            {
                // Defina o atalho para a tecla "1"
                let key_1_shortcut = Shortcut::new(None, Code::Digit1);

                // Registre o atalho com o Tauri
                app.handle().plugin(
                    tauri_plugin_global_shortcut::Builder::new().with_handler(move |_app, shortcut, event| {
                        println!("{:?}", shortcut);
                        if shortcut == &key_1_shortcut {
                            match event.state() {
                                ShortcutState::Pressed => {
                                  synchronize(_app);
                                }
                                ShortcutState::Released => {
                                }
                            }
                        }
                    })
                    .build(),
                )?;

                // Registrar o atalho global para a tecla "1"
                app.global_shortcut().register(key_1_shortcut)?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Erro ao rodar o aplicativo Tauri");
}