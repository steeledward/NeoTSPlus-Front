import api from "@/utils/api";

// Clase para manejar todas las solicitudes a la API de TSPlus
class TSPlusAPI {
  // Backup Data Settings
  static async backupData(optionalPath?: string, silent: boolean = false) {
    try {
      const response = await api.post(`/commands/backup_data/`, {
        optionalPath,
        silent,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al hacer backup de datos: ${error.message}`);
    }
  }

  // Web Server Commands
  static async webServer(command: string) {
    try {
      const response = await api.post(`/commands/web_server/`, {
        command,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al ejecutar comando del servidor web: ${error.message}`);
    }
  }

  // Restore Data Settings
  static async restoreData(restorePath: string, silent: boolean = false) {
    try {
      const response = await api.put(`/commands/restore_data/`, {
        restorePath,
        silent,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al restaurar datos: ${error.message}`);
    }
  }

  // Update
  static async update() {
    try {
      const response = await api.put(`/commands/update/`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al actualizar: ${error.message}`);
    }
  }

  // Windows Compatibility Updates
  static async windowsCompatibility() {
    try {
      const response = await api.put(`/commands/windows_compatibility/`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error en compatibilidad con Windows: ${error.message}`);
    }
  }

  // Install Universal Printer
  static async installPrinter() {
    try {
      const response = await api.post(`/commands/install_printer/`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al instalar impresora: ${error.message}`);
    }
  }

  // Remove Universal Printer
  static async removePrinter() {
    try {
      const response = await api.delete(`/commands/remove_printer/`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al eliminar impresora: ${error.message}`);
    }
  }

  // Proxy Set
  static async proxySet(command: string, params: string) {
    try {
      const response = await api.post(`/commands/proxy_set/`, {
        command,
        params,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al configurar proxy: ${error.message}`);
    }
  }

  // Web Credentials
  static async webCredentials() {
    try {
      const response = await api.post(`/commands/web_credentials/`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al obtener credenciales web: ${error.message}`);
    }
  }

  // Web Credentials Add
  static async webCredentialsAdd(webLogin: string, webPassword: string, windowsLogin: string, windowsPassword: string, maximumConcurrentSessions?: number) {
    try {
      const response = await api.post(`/commands/web_credentials_add/`, {
        webLogin,
        webPassword,
        windowsLogin,
        windowsPassword,
        maximumConcurrentSessions,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al añadir credenciales web: ${error.message}`);
    }
  }

  // Web Credentials Remove
  static async webCredentialsRemove(webLogin: string) {
    try {
      const response = await api.delete(`/commands/web_credentials_remove/`, { data: { webLogin } });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al eliminar credenciales web: ${error.message}`);
    }
  }

  // Session Manager
  static async sessionManager() {
    try {
      const response = await api.post(`/commands/session_manager/`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error en gestor de sesión: ${error.message}`);
    }
  }

  // Farm Sessions Monitor
  static async farmSessionsMonitor() {
    try {
      const response = await api.post(`/commands/farm_sessions_monitor/`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error en monitor de sesiones de la granja: ${error.message}`);
    }
  }

  // Farm LoadBalancing
  static async farmLoadbalancing() {
    try {
      const response = await api.post(`/commands/farm_loadbalancing/`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error en balanceo de carga de la granja: ${error.message}`);
    }
  }

  // System Audit
  static async systemAudit() {
    try {
      const response = await api.post(`/commands/system_audit/`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error en auditoría del sistema: ${error.message}`);
    }
  }

  // Activate License
  static async activateLicense(licensePath: string) {
    try {
      const response = await api.post(`/commands/activate_license/`, { licensePath });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al activar licencia: ${error.message}`);
    }
  }

  // License Reset
  static async licenseReset() {
    try {
      const response = await api.post(`/commands/license_reset/`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al resetear licencia: ${error.message}`);
    }
  }

  // Volume License Activate
  static async vlActivate(licensekey: string, users?: string, edition?: string, supportyears?: number, comments?: string) {
    try {
      const response = await api.post(`/commands/vl_activate/`, {
        licensekey,
        users,
        edition,
        supportyears,
        comments,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al activar licencia por volumen: ${error.message}`);
    }
  }

  // Volume License Enable
  static async vlEnable(licensekey: string) {
    try {
      const response = await api.post(`/commands/vl_enable/`, { licensekey });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al habilitar licencia por volumen: ${error.message}`);
    }
  }

  // Volume License Disable
  static async vlDisable(licensekey: string) {
    try {
      const response = await api.post(`/commands/vl_disable/`, { licensekey });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al deshabilitar licencia por volumen: ${error.message}`);
    }
  }

  // Volume License Update
  static async vlUpdate(licensekey: string, users?: string) {
    try {
      const response = await api.post(`/commands/vl_update/`, {
        licensekey,
        users,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al actualizar licencia por volumen: ${error.message}`);
    }
  }

  // Volume License Credits License
  static async vlCreditsLicense(licensekey: string, login?: string, edition?: string, silent?: boolean) {
    try {
      const response = await api.post(`/commands/vl_credits_license/`, {
        licensekey,
        login,
        edition,
        silent,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error en créditos de licencia por volumen: ${error.message}`);
    }
  }

  // Volume License Credits Support
  static async vlCreditsSupport(licensekey: string, login?: string, edition?: string, silent?: boolean) {
    try {
      const response = await api.post(`/commands/vl_credits_support/`, {
        licensekey,
        login,
        edition,
        silent,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error en créditos de soporte por volumen: ${error.message}`);
    }
  }

  // 2FA Reset User
  static async twofaResetUser(users: string[]) {
    try {
      const response = await api.post(`/commands/2fa_resetuser/`, { users });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al resetear usuario 2FA: ${error.message}`);
    }
  }

  // 2FA Add Users
  static async twofaAddUsers(userInfos: string[]) {
    try {
      const response = await api.post(`/commands/2fa_addusers/`, { userInfos });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al añadir usuarios 2FA: ${error.message}`);
    }
  }

  // 2FA Add Groups
  static async twofaAddGroups(groups: string[]) {
    try {
      const response = await api.post(`/commands/2fa_addgroups/`, { groups });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al añadir grupos 2FA: ${error.message}`);
    }
  }

  // 2FA Get Users
  static async twofaGetUsers() {
    try {
      const response = await api.get(`/commands/2fa_getusers/`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al obtener usuarios 2FA: ${error.message}`);
    }
  }

  // 2FA Delete User
  static async twofaDeleteUser(domainName: string, userType: string) {
    try {
      const response = await api.delete(`/commands/2fa_deleteuser/`, { data: { domainName, userType } });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al eliminar usuario 2FA: ${error.message}`);
    }
  }

  // Windows Credential AddOrUpdate
  static async windowsCredentialAddorupdate(csvFilePath?: string, target?: string, username?: string, password?: string) {
    try {
      const response = await api.post(`/commands/windowscredential_addorupdate/`, {
        csvFilePath,
        target,
        username,
        password,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al añadir/actualizar credencial de Windows: ${error.message}`);
    }
  }

  // Windows Credential Remove
  static async windowsCredentialRemove(csvFilePath?: string, username?: string) {
    try {
      const response = await api.delete(`/commands/windowscredential_remove/`, { data: { csvFilePath, username } });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error al eliminar credencial de Windows: ${error.message}`);
    }
  }
}

export default TSPlusAPI;
