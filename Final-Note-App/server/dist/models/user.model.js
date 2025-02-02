"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../config/database");
const error_1 = require("../utils/error");
const defaultPreferences = {
    theme: 'light',
    fontSize: 16,
    noteColor: '#ffffff',
    viewMode: 'grid'
};
class UserModel {
    static ensurePreferencesString(prefs) {
        if (!prefs) {
            return JSON.stringify(defaultPreferences);
        }
        if (typeof prefs === 'string') {
            try {
                // Validate it's parseable
                JSON.parse(prefs);
                return prefs;
            }
            catch (e) {
                return JSON.stringify(defaultPreferences);
            }
        }
        return JSON.stringify(prefs);
    }
    static ensurePreferencesObject(prefs) {
        if (!prefs) {
            return { ...defaultPreferences };
        }
        if (typeof prefs === 'string') {
            try {
                return { ...defaultPreferences, ...JSON.parse(prefs) };
            }
            catch (e) {
                return { ...defaultPreferences };
            }
        }
        return { ...defaultPreferences, ...prefs };
    }
    static mapRowToUser(row) {
        return {
            id: row.id,
            email: row.email,
            password: row.password,
            displayName: row.display_name,
            role: row.role,
            isVerified: row.isVerified,
            isActivated: row.is_activated,
            activationToken: row.activation_token || undefined,
            resetToken: row.reset_token || undefined,
            resetTokenExpires: row.reset_token_expires || undefined,
            preferences: this.ensurePreferencesObject(row.preferences),
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }
    static async create(user) {
        try {
            const [result] = await database_1.db.execute('INSERT INTO users (email, display_name, password, role, is_verified) VALUES (?, ?, ?, ?, ?)', [user.email, user.displayName, user.password, user.role, user.isVerified]);
            const newUser = await this.findById(result.insertId);
            if (!newUser)
                throw new error_1.DatabaseError('Error creating user');
            return newUser;
        }
        catch (error) {
            throw new error_1.DatabaseError('Error creating user');
        }
    }
    static async findById(id) {
        console.log('[UserModel.findById] Looking up user with id:', id, 'type:', typeof id);
        try {
            console.log('[UserModel.findById] Executing SQL query: SELECT * FROM users WHERE id = ?', [id]);
            const [rows] = await database_1.db.execute('SELECT * FROM users WHERE id = ?', [id]);
            console.log('[UserModel.findById] Query result rows count:', rows.length);
            if (rows.length) {
                console.log('[UserModel.findById] Found user with id:', rows[0].id);
            }
            else {
                console.log('[UserModel.findById] No user found with id:', id);
            }
            if (!rows.length)
                return null;
            const user = {
                ...rows[0],
                displayName: rows[0].display_name,
                isVerified: rows[0].is_verified,
            };
            return user;
        }
        catch (error) {
            throw new error_1.DatabaseError('Error finding user');
        }
    }
    static async findByEmail(email) {
        try {
            const [rows] = await database_1.db.execute('SELECT * FROM users WHERE email = ?', [email]);
            if (!rows.length)
                return null;
            const user = {
                ...rows[0],
                displayName: rows[0].display_name,
                isVerified: rows[0].is_verified,
            };
            return user;
        }
        catch (error) {
            throw new error_1.DatabaseError('Error finding user');
        }
    }
    static async findByActivationToken(token) {
        const [rows] = await database_1.db.execute('SELECT * FROM users WHERE activation_token = ?', [token]);
        return rows[0] ? this.mapRowToUser(rows[0]) : null;
    }
    static async findByResetToken(token) {
        const [rows] = await database_1.db.execute('SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()', [token]);
        return rows[0] ? this.mapRowToUser(rows[0]) : null;
    }
    static async update(id, updates) {
        try {
            const updateData = {};
            // Handle display name update
            if (updates.displayName !== undefined) {
                updateData.display_name = updates.displayName;
            }
            // Handle password update
            if (updates.password !== undefined) {
                updateData.password = updates.password;
            }
            // Handle role update
            if (updates.role !== undefined) {
                updateData.role = updates.role;
            }
            // Handle verification status update
            if (updates.isVerified !== undefined) {
                updateData.is_verified = updates.isVerified;
            }
            // Handle activation status update
            if (updates.isActivated !== undefined) {
                updateData.is_activated = updates.isActivated;
            }
            // Handle activation token update
            if (updates.activationToken !== undefined) {
                updateData.activation_token = updates.activationToken;
            }
            // Handle reset token update
            if (updates.resetToken !== undefined) {
                updateData.reset_token = updates.resetToken;
            }
            // Handle reset token expiration update
            if (updates.resetTokenExpires !== undefined) {
                updateData.reset_token_expires = updates.resetTokenExpires;
            }
            // Handle preferences update
            if (updates.preferences) {
                updateData.preferences = this.ensurePreferencesString(updates.preferences);
            }
            // Only proceed if we have updates to make
            if (Object.keys(updateData).length === 0) {
                return true;
            }
            // Build SET clause
            const setClause = Object.keys(updateData)
                .map(key => `${key} = ?`)
                .join(', ');
            // Build values array
            const values = [...Object.values(updateData), id];
            const [result] = await database_1.db.execute(`UPDATE users SET ${setClause} WHERE id = ?`, values);
            return result.affectedRows > 0;
        }
        catch (error) {
            console.error('Error updating user:', error);
            throw new error_1.DatabaseError('Error updating user');
        }
    }
    static async updatePreferences(id, preferences) {
        const preferencesString = this.ensurePreferencesString(preferences);
        const [result] = await database_1.db.execute('UPDATE users SET preferences = ? WHERE id = ?', [preferencesString, id]);
        return result.affectedRows > 0;
    }
    static async verifyPassword(user, password) {
        return bcryptjs_1.default.compare(password, user.password);
    }
    static async delete(id) {
        try {
            const [result] = await database_1.db.execute('DELETE FROM users WHERE id = ?', [id]);
            return result.affectedRows > 0;
        }
        catch (error) {
            throw new error_1.DatabaseError('Error deleting user');
        }
    }
}
exports.UserModel = UserModel;
