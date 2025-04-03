<template>
    <div class="p-8">
      <h1 class="text-2xl font-bold mb-6">🧾 Clients avec adresse complète</h1>
  
      <table class="w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead class="bg-gray-100 text-left">
          <tr>
            <th class="p-3">Name</th>
            <th class="p-3">Email</th>
            <th class="p-3">Phone</th>
            <th class="p-3">Address</th>
            <th class="p-3">Jersey Color</th>
            <th class="p-3">Image</th>
            <th class="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="client in clients"
            :key="client.id"
            class="border-t hover:bg-gray-50"
          >
            <td class="p-3">{{ client.firstName }} {{ client.lastName }}</td>
            <td class="p-3">{{ client.email }}</td>
            <td class="p-3">{{ client.phoneNumber }}</td>
            <td class="p-3">
              {{ client.street }}, {{ client.postalCode }}<br />
              {{ client.city }}, {{ client.country }}
            </td>
            <td class="p-3">
              <span
                v-if="client.jersey"
                class="inline-block w-5 h-5 rounded-full border"
                :style="{ backgroundColor: client.jersey.color }"
                :title="client.jersey.color"
              >{{ client.jersey.color }}</span>
              <span v-else class="text-gray-400 italic">—</span>
            </td>
            <td class="p-3">
              <a
                v-if="client.jersey"
                :href="getImageUrl(client.jersey.drawingFile)"
                target="_blank"
                class="text-blue-600 underline text-sm"
              >
                See image
              </a>
              <span v-else class="text-gray-400 italic">—</span>
            </td>
            <td class="p-3">
              <button
                @click="deleteClient(client.id)"
                class="text-red-600 underline text-sm hover:text-red-800"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <p v-if="clients.length === 0" class="mt-6 text-gray-500 text-sm">
        None
      </p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const clients = ref([])
  
  const getImageUrl = (filename) => {
    return `http://localhost:3001/uploads/${filename}`
  }
  
  const fetchClients = async () => {
    try {
      const res = await fetch('http://localhost:3001/clients')
      const data = await res.json()
  
      // Ne garder que les clients avec adresse complète
      clients.value = data.filter(
        (client) => client.street && client.postalCode
      )
    } catch (err) {
      console.error('Erreur lors du chargement des clients :', err)
    }
  }
  
  const deleteClient = async (id) => {
    if (!confirm("Supprimer ce client ?")) return;
  
    try {
      const res = await fetch(`http://localhost:3001/clients/${id}`, {
        method: "DELETE",
      });
  
      if (res.ok) {
        clients.value = clients.value.filter((c) => c.id !== id)
      } else {
        alert("Échec de la suppression.");
      }
    } catch (err) {
      console.error("Erreur suppression :", err);
      alert("Erreur de connexion au serveur.");
    }
  }
  
  onMounted(fetchClients)
  </script>
  
  <style scoped>
  table {
    border-collapse: collapse;
    width: 100%;
  }
  th,
  td {
    border: 1px solid #ddd;
  }
  .p-8{
padding: 5%;
  }
  </style>
  