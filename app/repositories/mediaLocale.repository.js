const db = require('../config/db'); // MySQL connection instance

class MediaRepository {
    async createMedia({ name='image',file_key, addon_ids, url, organization_id, file_type }) {
        const query = `
      INSERT INTO media (name, file_key, addon_ids, url, organization_id, file_type)
      VALUES (?,?, ?, ?, ?, ?);
    `;
        const [result] = await db.execute(query, [
            name,
            file_key,
            JSON.stringify(addon_ids || []),
            url,
            organization_id,
            file_type,
        ]);
        return result.insertId;
    }

    async getMediaById(id) {
        const query = `SELECT * FROM media WHERE id = ?;`;
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    async getMediaByUrl(url) {
        const query = `SELECT * FROM media WHERE url = ?;`;
        const [rows] = await db.execute(query, [url]);
        return rows[0];
    }

    async getAllMediaByOrganization(organization_id, addon_ids) {
        if (addon_ids && addon_ids.length > 0) {
            // Build the dynamic query with OR conditions for each addon_id
            const conditions = addon_ids
                .map(() => `JSON_CONTAINS(addon_ids, JSON_ARRAY(?), '$')`)
                .join(' OR ');
            // Create the parameter list: organization_id + addon_ids
            const params = [organization_id, ...addon_ids];
            // Execute the query with the parameters
            const query = `
            SELECT * FROM media 
            WHERE organization_id = ? AND file_type = 'MEDIA' AND (${conditions});
        `;
            const [rows] = await db.query(query, params);
            return rows;
        } else {
            const query = `SELECT * FROM media WHERE organization_id = ? AND file_type = 'MEDIA';`;
            const [rows] = await db.execute(query, [organization_id]);
            return rows;
        }
    }


    async getProfileImg(organization_id) {
        const query = `SELECT * FROM media WHERE organization_id = ? AND file_type = 'PROFILE' LIMIT 1;`;
        const [rows] = await db.execute(query, [organization_id]);
        return rows;
    }
    
    async getOrgLogo(organization_id) {
        const query = `SELECT * FROM media WHERE organization_id = ? AND file_type = 'LOGO' LIMIT 1;`;
        const [rows] = await db.execute(query, [organization_id]);
        return rows;
    }

    async updateMedia(id, updates) {
        const fields = Object.keys(updates)
            .map((key) => `${key} = ?`)
            .join(', ');

        const values = [...Object.values(updates), id];

        const query = `
      UPDATE media
      SET ${fields}, updated_at = NOW()
      WHERE id = ?;
    `;
        await db.execute(query, values);
    }

    async deleteMedia(id) {
        const query = `DELETE FROM media WHERE id = ?;`;
        await db.execute(query, [id]);
    }

    async deleteMediaByKey(file_key) {
        const query = `DELETE FROM media WHERE file_key = ?;`;
        await db.execute(query, [file_key]);
    }

    async deleteMediaByUrl(url) {
        const query = `DELETE FROM media WHERE url = ?;`;
        await db.execute(query, [url]);
    }

    async deleteMediaByOrgId(orgId) {
        const query = `DELETE FROM media WHERE organization_id = ?;`;
        await db.execute(query, [orgId]);
    }
}

module.exports = { MediaRepository };
