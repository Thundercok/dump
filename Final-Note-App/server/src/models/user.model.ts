import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { db } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { AppError } from '../middleware/errorHandler';
import { User, UserPreferences, UpdateUserDTO } from '../types';
import { DatabaseError } from '../utils/error';

const defaultPreferences: UserPreferences = {
  theme: 'light',
  fontSize: 16,
  noteColor: '#ffffff',
  viewMode: 'grid'
};

export interface UserRow extends Omit<User, 'preferences'>, RowDataPacket {
  preferences: string | null;
  display_name: string;
  is_activated: boolean;
  activation_token: string | null;
  reset_token: string | null;
  reset_token_expires: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserDTO {
  email: string;
  displayName: string;
  password: string;
  role?: 'user' | 'admin';
  isVerified?: boolean;
  isActivated?: boolean;
  activationToken?: string;
  resetToken?: string;
  resetTokenExpires?: Date;
  preferences?: UserPreferences;
}

export class UserModel {
  private static ensurePreferencesString(prefs: UserPreferences | string | null | undefined): string {
    if (!prefs) {
      return JSON.stringify(defaultPreferences);
    }
    if (typeof prefs === 'string') {
      try {
        // Validate it's parseable
        JSON.parse(prefs);
        return prefs;
      } catch (e) {
        return JSON.stringify(defaultPreferences);
      }
    }
    return JSON.stringify(prefs);
  }

  private static ensurePreferencesObject(prefs: string | UserPreferences | null): UserPreferences {
    if (!prefs) {
      return { ...defaultPreferences };
    }
    if (typeof prefs === 'string') {
      try {
        return { ...defaultPreferences, ...JSON.parse(prefs) };
      } catch (e) {
        return { ...defaultPreferences };
      }
    }
    return { ...defaultPreferences, ...prefs };
  }

  private static mapRowToUser(row: UserRow): User {
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

  static async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const [result] = await db.execute(
        'INSERT INTO users (email, display_name, password, role, is_verified) VALUES (?, ?, ?, ?, ?)',
        [user.email, user.displayName, user.password, user.role, user.isVerified]
      );

      const newUser = await this.findById((result as any).insertId);
      if (!newUser) throw new DatabaseError('Error creating user');

      return newUser;
    } catch (error) {
      throw new DatabaseError('Error creating user');
    }
  }

  static async findById(id: number): Promise<User | null> {
    console.log('[UserModel.findById] Looking up user with id:', id, 'type:', typeof id);
    try {
      console.log('[UserModel.findById] Executing SQL query: SELECT * FROM users WHERE id = ?', [id]);
      const [rows] = await db.execute<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [id]);
      console.log('[UserModel.findById] Query result rows count:', rows.length);
      if (rows.length) {
        console.log('[UserModel.findById] Found user with id:', rows[0].id);
      } else {
        console.log('[UserModel.findById] No user found with id:', id);
      }

      if (!rows.length) return null;

      const user = {
        ...rows[0],
        displayName: rows[0].display_name,
        isVerified: rows[0].is_verified,
      } as User;
      return user;
    } catch (error) {
      throw new DatabaseError('Error finding user');
    }
  }

  static async findByEmail(email: string): Promise<User | null> {
    try {
      const [rows] = await db.execute<RowDataPacket[]>(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (!rows.length) return null;

      const user = {
        ...rows[0],
        displayName: rows[0].display_name,
        isVerified: rows[0].is_verified,
      } as User;
      return user;
    } catch (error) {
      throw new DatabaseError('Error finding user');
    }
  }

  static async findByActivationToken(token: string): Promise<User | null> {
    const [rows] = await db.execute<UserRow[]>(
      'SELECT * FROM users WHERE activation_token = ?',
      [token]
    );

    return rows[0] ? this.mapRowToUser(rows[0]) : null;
  }

  static async findByResetToken(token: string): Promise<User | null> {
    const [rows] = await db.execute<UserRow[]>(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
      [token]
    );

    return rows[0] ? this.mapRowToUser(rows[0]) : null;
  }

  static async update(id: number, updates: Partial<UpdateUserDTO>): Promise<boolean> {
    try {
      const updateData: any = {};
      
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
      
      const [result] = await db.execute<ResultSetHeader>(
        `UPDATE users SET ${setClause} WHERE id = ?`,
        values
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new DatabaseError('Error updating user');
    }
  }

  static async updatePreferences(id: number, preferences: UserPreferences): Promise<boolean> {
    const preferencesString = this.ensurePreferencesString(preferences);
    const [result] = await db.execute<ResultSetHeader>(
      'UPDATE users SET preferences = ? WHERE id = ?',
      [preferencesString, id]
    );

    return result.affectedRows > 0;
  }

  static async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  static async delete(id: number): Promise<boolean> {
    try {
      const [result] = await db.execute<ResultSetHeader>(
        'DELETE FROM users WHERE id = ?',
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw new DatabaseError('Error deleting user');
    }
  }
} 
