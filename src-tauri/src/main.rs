use tauri::{Manager, AppHandle, Emitter};
use device_query::{DeviceQuery, Keycode, DeviceState};


fn emitir_evento(app: &tauri::AppHandle, evento: &str) {
    app.emit(evento, None::<()>).expect("Falha ao emitir evento");
}


// Alterna as bordas da janela (decorations) e permite clicar através
fn toggle_decorations(app: &AppHandle) {
    let window = app.get_webview_window("listamestra").expect("Janela não encontrada");
    let is_decorated = window.is_decorated().unwrap_or(true); // Obtém o estado atual
    window.set_decorations(!is_decorated).expect("Falha ao alternar decorations");
    app.emit("esconder", None::<()>).expect("Falha ao emitir evento");

    // Se as decorações estiverem desativadas, permitir clicar através da janela
    if !is_decorated {
        window.set_ignore_cursor_events(false).expect("Falha ao configurar ignorar eventos do cursor");
        app.emit("exibir", None::<()>).expect("Falha ao emitir evento");
    } else {
        window.set_ignore_cursor_events(true).expect("Falha ao reverter ignorar eventos do cursor");
    }
}

fn monitor_keyboard(app: AppHandle) {
    let device_state = DeviceState::new();
    loop {
        let keys = device_state.get_keys();
        if keys.contains(&Keycode::Key1) {
            emitir_evento(&app, "pocao");
        }
        if keys.contains(&Keycode::E) {
            emitir_evento(&app, "ultimate");
        }
        if keys.contains(&Keycode::R) {
            emitir_evento(&app, "peito");
        }
        if keys.contains(&Keycode::F) {
            emitir_evento(&app, "bota");
        }
        if keys.contains(&Keycode::D) {
            emitir_evento(&app, "elmo");
        }
        if keys.contains(&Keycode::F2) {
            toggle_decorations(&app);
            std::thread::sleep(std::time::Duration::from_millis(500)); // Evita múltiplos acionamentos rápidos
        }
        std::thread::sleep(std::time::Duration::from_millis(100)); // Reduz uso da CPU
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.handle().clone();
            std::thread::spawn(move || {
                monitor_keyboard(app_handle);
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Erro ao rodar o aplicativo Tauri");
}
