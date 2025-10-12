# 🚀 Démarrage Rapide - RizeAppHub™

## ⚡ Configuration en 3 Minutes

### Étape 1 : Créer les Tables Supabase (2 min)

1. **Ouvrir Supabase**
   - Allez sur https://supabase.com/dashboard
   - Connectez-vous à votre compte
   - Sélectionnez votre projet : `kwzurhhbvfkrvhbcdhwi`

2. **Exécuter le Script SQL**
   - Cliquez sur **SQL Editor** (icône </> dans le menu de gauche)
   - Cliquez sur **+ New Query**
   - Ouvrez le fichier `SUPABASE_COMPLETE_SETUP.sql` dans votre éditeur
   - **Copiez TOUT le contenu** (Ctrl+A puis Ctrl+C)
   - **Collez** dans l'éditeur SQL Supabase (Ctrl+V)
   - Cliquez sur **RUN** (ou F5)
   - ✅ Attendez que le script se termine (5-10 secondes)

3. **Vérifier que tout est OK**
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   ORDER BY table_name;
   ```
   - Vous devriez voir 7 tables :
     - admin_codes ✅
     - calendar_events ✅
     - call_details ✅
     - call_history ✅
     - call_notes ✅
     - user_profiles ✅
     - user_tokens ✅

### Étape 2 : Lancer l'Application (30 secondes)

```bash
# Si ce n'est pas déjà fait, naviguer dans le dossier
cd "RizeApp™ V1 MVP"

# Lancer l'app
npm run dev
```

**L'application sera disponible sur :** http://localhost:5000

### Étape 3 : Tester (1 min)

#### Test 1 : Créer un compte utilisateur
1. Allez sur http://localhost:5000
2. Cliquez sur **"Je m'inscris"**
3. Remplissez le formulaire :
   - Email : votre@email.com
   - Mot de passe : minimum 6 caractères
   - Nom complet : Votre Nom
4. Cliquez sur **"S'inscrire"**
5. ✅ Vous êtes redirigé vers `/onboarding`

#### Test 2 : Accéder au Dashboard Admin
1. Retournez sur la page d'accueil (http://localhost:5000)
2. Cliquez sur **"Admin"** (petit bouton gris en haut à droite)
3. Entrez le code : `admin123`
4. ✅ Vous accédez au dashboard admin
5. ✅ Vous voyez votre utilisateur dans la liste

#### Test 3 : Protection des routes
1. Ouvrez une fenêtre de navigation privée
2. Allez sur http://localhost:5000/dashboard
3. ✅ Vous êtes automatiquement redirigé vers `/`

---

## 🎯 Codes Admin Disponibles

Utilisez ces codes pour accéder au dashboard admin :

| Code | Niveau |
|------|--------|
| `admin123` | Admin |
| `smartapp2024` | Admin |
| `academy2024` | Admin |
| `master2024` | Super Admin |
| `superadmin` | Super Admin |

---

## ✅ C'est Prêt !

Votre application **RizeAppHub™** est maintenant complètement opérationnelle avec :

- ✅ Authentification sécurisée (Supabase)
- ✅ Protection des routes
- ✅ Dashboard utilisateur
- ✅ Dashboard admin avec codes
- ✅ Système de tokens pour réservations
- ✅ Calendrier intégré
- ✅ Historique des appels

---

## 🔥 Points Importants

### Routes Protégées 🔒
- `/onboarding` - Nécessite connexion
- `/dashboard` - Nécessite connexion

### Routes Publiques 🌍
- `/` - Page d'accueil
- `/admin-dashboard` - Dashboard admin (avec code)

### Déconnexion
- Cliquez sur le bouton **"Déconnexion"** dans le sidebar
- Votre session Supabase sera complètement nettoyée
- Vous serez redirigé vers la page d'accueil

---

## 📖 Documentation Complète

Pour plus de détails, consultez :
- `CONFIGURATION_SUPABASE.md` - Configuration détaillée
- `RESUME_MODIFICATIONS.md` - Liste des modifications
- `SUPABASE_COMPLETE_SETUP.sql` - Script SQL complet

---

## 🆘 Besoin d'Aide ?

**Problème avec Supabase ?**
→ Consultez `CONFIGURATION_SUPABASE.md` section "Support & Troubleshooting"

**Problème d'authentification ?**
→ Vérifiez que les tables sont créées dans Supabase

**L'app ne démarre pas ?**
```bash
# Assurez-vous d'être dans le bon dossier
cd "RizeApp™ V1 MVP"

# Réinstallez les dépendances si nécessaire
npm install

# Relancez
npm run dev
```

---

**🚀 Bon développement avec RizeAppHub™ !**

