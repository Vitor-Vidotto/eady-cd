use tauri::{Manager, AppHandle, Emitter};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};

fn synchronize(app: &tauri::AppHandle) {
  // Emite o evento 'cooldown' para todas as webviews
  app.emit("cooldown", None::<()>).expect("Falha ao emitir evento");
  println!("emitido")
}
fn ult(app: &tauri::AppHandle) {
  // Emite o evento 'cooldown' para todas as webviews
  app.emit("ultimate", None::<()>).expect("Falha ao emitir evento");
  println!("ultimate")
}
fn peito(app: &tauri::AppHandle) {
    // Emite o evento 'cooldown' para todas as webviews
    app.emit("peito", None::<()>).expect("Falha ao emitir evento");
    println!("peito")
  }
fn bota(app: &tauri::AppHandle) {
    // Emite o evento 'cooldown' para todas as webviews
    app.emit("bota", None::<()>).expect("Falha ao emitir evento");
    println!("bota")
  }
fn pocao(app: &tauri::AppHandle) {
    // Emite o evento 'cooldown' para todas as webviews
    app.emit("pocao", None::<()>).expect("Falha ao emitir evento");
    println!("pocao")
  }
  fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(desktop)]
            {
                // Defina os atalhos para as teclas
                let key_1_shortcut = Shortcut::new(None, Code::Digit1);  // Atalho para Poção
                let key_e_shortcut = Shortcut::new(None, Code::KeyE);    // Atalho para Ultimate
                let key_r_shortcut = Shortcut::new(None, Code::KeyR);    // Atalho para Peito
                let key_f_shortcut = Shortcut::new(None, Code::KeyF);    // Atalho para Bota

                // Registre os atalhos com o Tauri
                app.handle().plugin(
                    tauri_plugin_global_shortcut::Builder::new().with_handler(move |_app, shortcut, event| {
                        println!("{:?}", shortcut);
                        match shortcut {
                            // Atalho para Poção (1)
                            _ if shortcut == &key_1_shortcut => {
                                match event.state() {
                                    ShortcutState::Pressed => {
                                        pocao(_app);  // Chama a função que emite o evento para Poção
                                    }
                                    ShortcutState::Released => {}
                                }
                            }
                            // Atalho para Ultimate (E)
                            _ if shortcut == &key_e_shortcut => {
                                match event.state() {
                                    ShortcutState::Pressed => {
                                        ult(_app);  // Chama a função que emite o evento para Ultimate
                                    }
                                    ShortcutState::Released => {}
                                }
                            }
                            // Atalho para Peito (R)
                            _ if shortcut == &key_r_shortcut => {
                                match event.state() {
                                    ShortcutState::Pressed => {
                                        peito(_app);  // Chama a função que emite o evento para Peito
                                    }
                                    ShortcutState::Released => {}
                                }
                            }
                            // Atalho para Bota (F)
                            _ if shortcut == &key_f_shortcut => {
                                match event.state() {
                                    ShortcutState::Pressed => {
                                        bota(_app);  // Chama a função que emite o evento para Bota
                                    }
                                    ShortcutState::Released => {}
                                }
                            }
                            _ => {}
                        }
                    })
                    .build(),
                )?;

                // Registrar os atalhos globais para as teclas
                app.global_shortcut().register(key_1_shortcut)?;
                app.global_shortcut().register(key_e_shortcut)?;
                app.global_shortcut().register(key_r_shortcut)?;
                app.global_shortcut().register(key_f_shortcut)?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Erro ao rodar o aplicativo Tauri");
}