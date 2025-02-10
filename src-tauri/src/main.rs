use tauri::{Manager, AppHandle, Emitter};
use device_query::{DeviceQuery, Keycode, DeviceState};

fn synchronize(app: &tauri::AppHandle) {
    app.emit("cooldown", None::<()>).expect("Falha ao emitir evento");
    println!("emitido")
}

fn ult(app: &tauri::AppHandle) {
    app.emit("ultimate", None::<()>).expect("Falha ao emitir evento");
    println!("ultimate")
}

fn peito(app: &tauri::AppHandle) {
    app.emit("peito", None::<()>).expect("Falha ao emitir evento");
    println!("peito")
}

fn bota(app: &tauri::AppHandle) {
    app.emit("bota", None::<()>).expect("Falha ao emitir evento");
    println!("bota")
}

fn pocao(app: &tauri::AppHandle) {
    app.emit("pocao", None::<()>).expect("Falha ao emitir evento");
    println!("pocao")
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
        std::thread::sleep(std::time::Duration::from_millis(100)); // Evitar uso excessivo de CPU
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // Iniciar a monitoração do teclado em uma thread separada
            let app_handle = app.handle().clone();
            std::thread::spawn(move || {
                monitor_keyboard(app_handle);
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Erro ao rodar o aplicativo Tauri");
}
