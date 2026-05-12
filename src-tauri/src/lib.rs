mod bg_removal;
mod commands;
mod converter;
mod error;
mod fs_utils;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            commands::get_file_info,
            commands::validate_output_dir,
            commands::convert_images,
        ])
        .run(tauri::generate_context!())
        .expect("error while running application");
}
