use tauri::{Manager, AppHandle, Emitter};
use device_query::{DeviceQuery, Keycode, DeviceState};

fn synchronize(app: &tauri::AppHandle) {
    app.emit("cooldown", None::<()>).expect("Falha ao emitir evento");
    println!("emitido");
}

fn ult(app: &tauri::AppHandle) {
    app.emit("ultimate", None::<()>).expect("Falha ao emitir evento");
    println!("ultimate");
}

fn peito(app: &tauri::AppHandle) {
    app.emit("peito", None::<()>).expect("Falha ao emitir evento");
    println!("peito");
}

fn bota(app: &tauri::AppHandle) {
    app.emit("bota", None::<()>).expect("Falha ao emitir evento");
    println!("bota");
}

fn pocao(app: &tauri::AppHandle) {
    app.emit("pocao", None::<()>).expect("Falha ao emitir evento");
    println!("pocao");
}

// Alterna as bordas da janela (decorations) e permite clicar através
fn toggle_decorations(app: &AppHandle) {
    let window = app.get_webview_window("listamestra").expect("Janela não encontrada");
    let is_decorated = window.is_decorated().unwrap_or(true); // Obtém o estado atual
    window.set_decorations(!is_decorated).expect("Falha ao alternar decorations");

    // Se as decorações estiverem desativadas, permitir clicar através da janela
    if !is_decorated {
        window.set_ignore_cursor_events(false).expect("Falha ao configurar ignorar eventos do cursor");
        println!("Decorations removidas, clicando através.");
    } else {
        window.set_ignore_cursor_events(true).expect("Falha ao reverter ignorar eventos do cursor");
        println!("Decorations ativadas.");
    }
}

fn monitor_keyboard(app: AppHandle) {
    let device_state = DeviceState::new();
    loop {
        let keys = device_state.get_keys();
        if keys.contains(&Keycode::Key1) {
            pocao(&app);
        }
        if keys.contains(&Keycode::E) {
            ult(&app);
        }
        if keys.contains(&Keycode::R) {
            peito(&app);
        }
        if keys.contains(&Keycode::F) {
            bota(&app);
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
