# 🔧 Configuração CORS para Backend Belle Biju

## Problema

O frontend na Vercel está recebendo erro de CORS ao tentar acessar o backend no Railway.

## URLs que precisam ser permitidas:

### Frontend (Vercel)

- `https://belle-biju-react-v2.vercel.app`
- `https://belle-biju-react-v2-git-main-gabslopes055.vercel.app`
- `https://belle-biju-react-v2-gabslopes055.vercel.app`

### Backend (Railway)

- `https://bellebiju-backend-production-5cda.up.railway.app`

## 🔧 Configuração no Spring Boot

### Opção 1: Configuração Global (Recomendada)

```java
@Configuration
@EnableWebMvc
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                    "https://belle-biju-react-v2.vercel.app",
                    "https://belle-biju-react-v2-git-main-gabslopes055.vercel.app",
                    "https://belle-biju-react-v2-gabslopes055.vercel.app",
                    "http://localhost:3000",
                    "http://localhost:3001"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "TRACE", "CONNECT")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### Opção 2: Configuração com @CrossOrigin

```java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {
    "https://belle-biju-react-v2.vercel.app",
    "https://belle-biju-react-v2-git-main-gabslopes055.vercel.app",
    "https://belle-biju-react-v2-gabslopes055.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001"
})
public class AuthenticationController {
    // ... seus endpoints
}
```

### Opção 3: Configuração no SecurityConfig

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            // ... outras configurações
            ;
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(Arrays.asList(
            "https://belle-biju-react-v2.vercel.app",
            "https://belle-biju-react-v2-git-main-gabslopes055.vercel.app",
            "https://belle-biju-react-v2-gabslopes055.vercel.app",
            "http://localhost:3000",
            "http://localhost:3001"
        ));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);

        return source;
    }
}
```

## 🚀 Como Aplicar

1. **Escolha uma das opções acima** (recomendo a Opção 1)
2. **Adicione o código** no seu projeto Spring Boot
3. **Faça o deploy** do backend atualizado
4. **Teste** o frontend na Vercel

## 🔍 Verificação

Após aplicar, você pode verificar se o CORS está funcionando:

```bash
# Teste no navegador (F12 -> Console)
fetch('https://bellebiju-backend-production-5cda.up.railway.app/api/authentication/validate', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer seu-token-aqui'
  }
})
.then(response => response.json())
.then(data => console.log('Sucesso:', data))
.catch(error => console.error('Erro:', error));
```

## 📝 Notas Importantes

- **allowCredentials(true)**: Necessário para enviar cookies/tokens
- **maxAge(3600)**: Cache das configurações CORS por 1 hora
- **allowedHeaders("\*")**: Permite todos os headers (incluindo Authorization)
- **OPTIONS**: Método necessário para preflight requests

## 🆘 Se ainda houver problemas

1. Verifique se o backend foi deployado corretamente
2. Confirme se as URLs estão exatamente corretas
3. Teste com Postman ou Insomnia
4. Verifique os logs do backend no Railway
