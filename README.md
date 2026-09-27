# NGINX Load Balancing Lab

A hands-on project for learning how NGINX routes traffic to Node.js services, how load-balancing strategies differ, and how consistent hashing can be implemented and compared with NGINX.

The roadmap below separates what is already represented in the current configuration from the experiments still to build. The current Compose setup runs NGINX and two Express service instances.

## Current Setup

```text
Client
	|
	v
NGINX :8080
	|-- /health -> NGINX health response
	`-- other paths -> backend upstream
											 |-- service1 :3001
											 |-- service2 :3002
											 `-- configured LAN address
```

NGINX listens on port `80` inside its container and Docker publishes it at `http://localhost:8080`. The Express containers listen on ports `3001` and `3002` and are reachable by their Compose service names on the internal Docker network.

The `backend` upstream currently lists `service1`, `service2`, and a hard-coded LAN address. NGINX uses round robin by default when no balancing method is specified, but the LAN address must be reachable for every upstream entry to be useful.

## Run It

Build and start the containers:

```sh
docker compose up -d --build
```

Check container status and logs:

```sh
docker compose ps
docker compose logs -f nginx service1 service2
```

Try the routes:

```sh
curl http://localhost:8080/health
curl http://localhost:8080/
curl http://localhost:8080/products
curl http://localhost:8080/products/1
```

`/health` is answered directly by NGINX with the text `NGINX is healthy`. The Express service also has a `/health` endpoint, but requests to that path through NGINX currently receive NGINX's response instead.

**Current configuration note:** [nginx.conf](nginx.conf) sends `/products` to `products_service`, but there is no `products_service` upstream defined yet. That route needs to be wired to an actual service before it can be relied on. The general backend upstream also contains a machine-specific IP address; remove or replace it when it is not part of the experiment.

Stop the containers when finished:

```sh
docker compose down
```

## Learning Roadmap

- [x] **1. NGINX in Docker** — run NGINX with Docker Compose.
- [x] **2. `/health` endpoint** — return a simple health response from NGINX.
- [x] **3. Reverse proxy to one Node service** — proxy requests to an Express container.
- [x] **4. Reverse proxy to two Node services** — define two Express instances in Compose.
- [x] **5. Round-robin load balancing** — use NGINX's default upstream behavior across configured servers.
- [ ] **6. Weighted load balancing** — assign different traffic weights to upstream servers.
- [ ] **7. NGINX hash** — configure hash-based upstream selection.
- [ ] **8. Understand normal-hash remapping** — observe how adding or removing a server can change key-to-server assignments.
- [ ] **9. Implement consistent hashing in TypeScript** — build a hash ring and test how it distributes keys and handles membership changes.
- [ ] **10. Compare with NGINX** — compare distribution and remapping behavior using the same server and key scenarios.

The checked steps reflect capabilities present in the current project files; they are not a claim that every behavior has been fully tested. The remaining steps are planned experiments.
