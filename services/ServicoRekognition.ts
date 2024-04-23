import { 
    AssociateFacesCommand, 
    AssociateFacesCommandOutput, 
    CompareFacesCommand, 
    CompareFacesCommandOutput, 
    CreateCollectionCommand, 
    CreateCollectionCommandOutput, 
    CreateUserCommand, 
    CreateUserCommandOutput, 
    DeleteCollectionCommand, 
    DeleteCollectionCommandOutput, 
    DeleteFacesCommand, 
    DeleteFacesCommandOutput, 
    DeleteUserCommand, 
    DeleteUserCommandOutput, 
    DetectFacesCommand, 
    DetectFacesCommandOutput, 
    IndexFacesCommand, 
    IndexFacesCommandOutput, 
    ListCollectionsCommand, 
    ListCollectionsCommandOutput, 
    ListFacesCommand, 
    ListFacesCommandOutput, 
    RekognitionClient, 
    SearchFacesByImageCommand, 
    SearchFacesByImageCommandOutput 
} from "@aws-sdk/client-rekognition";
import { fromIni } from "@aws-sdk/credential-providers";

/**
 * Uma classe que fornece métodos para interagir com os serviços da AWS, Amazon Rekognition.
 */
export class ServicoRekognition {

    private REGION = ""; // Defina a região da AWS apropriada
    private perfilName = ""; // Nome do perfil AWS para autenticação
    private bucketName = ""; // Nome do bucket S3 utilizado, se aplicável
    private rekogClient: RekognitionClient; // Cliente Rekognition


    constructor() {
        this.rekogClient = new RekognitionClient({
            region: this.REGION,
            credentials: fromIni({ profile: this.perfilName }),
        });
    }

    /**
     * Compara uma imagem local com uma imagem armazenada em um bucket S3 usando o serviço Amazon Rekognition.
     * @param imagemLocal O buffer da imagem local a ser comparada.
     * @param caminhoDaImagem O caminho da imagem armazenada no bucket S3 a ser comparada.
     * @returns Uma Promise que resolve com um objeto CompareFacesCommandOutput se a comparação for bem-sucedida, caso contrário, retorna void.
     */
    public async ComparaComImagemNoBucket(imagemLocal: Buffer, caminhoDaImagem: string): Promise<CompareFacesCommandOutput | void> {
   
        try {
            const params = {
                SourceImage: {
                    Bytes: imagemLocal
                },
                TargetImage: {
                    S3Object: {
                        Bucket: this.bucketName,
                        Name: caminhoDaImagem
                    }
                },
                SimilarityThreshold: 85
            };

            const command = new CompareFacesCommand(params);
            const response = await this.rekogClient.send(command);
            return response; 
        } catch (err) {
            console.error('Erro ao comparar rostos:', err);
        }
    }

    /**
     * Detecta rostos em uma imagem usando o serviço Amazon Rekognition.
     * @param imagem O buffer da imagem na qual os rostos serão detectados.
     * @returns Uma Promise que resolve com um objeto DetectFacesCommandOutput contendo as informações dos rostos detectados.
     */
    async existePessoaNaImagem(imagem: Buffer): Promise<DetectFacesCommandOutput| void> {

        try {
            const params = {
                Image: {
                    Bytes: imagem
                }
            };

            const command = new DetectFacesCommand(params);
            const response = await this.rekogClient.send(command);

            return response;
        }catch(err:any){
            console.error(err)
        }
        
        
    }

        /**
     * Cria uma nova coleção no Amazon Rekognition com o ID especificado.
     * @param collectionName O nome da coleção a ser criada.
     * @returns Uma Promise que resolve com um objeto CreateCollectionCommandOutput se a criação for bem-sucedida, caso contrário, retorna void.
     */
        public async criaCollection(collectionName: string): Promise<CreateCollectionCommandOutput | void> {
            try {
                const params = {
                    CollectionId: collectionName,
                };
    
                const command = new CreateCollectionCommand(params);
                const data = await this.rekogClient.send(command);
                return data;
            } catch (err) {
                console.log("Error", err);
            }
        };
    
        /**
         * Lista todas as coleções criadas no Amazon Rekognition.
         * @returns Uma Promise que resolve com um objeto ListCollectionsCommandOutput contendo as informações das coleções.
         */
        public async listaCollections(): Promise<ListCollectionsCommandOutput | void> {
            try{
                const command = new ListCollectionsCommand({});
                const response = await this.rekogClient.send(command);
                return response;
            }catch(err: any){
                console.log(err)
            }
            
        }
    
        /**
         * Compara uma imagem com rostos em uma coleção do Amazon Rekognition.
         * @param CollectionId O ID da coleção na qual a busca será realizada.
         * @param pessoasFotoBufer O buffer da imagem contendo os rostos a serem comparados.
         * @returns Uma Promise que resolve com um objeto SearchFacesByImageCommandOutput se a comparação for bem-sucedida, caso contrário, retorna void.
         */
        async compararComCollection(CollectionId: string, pessoasFotoBufer: Buffer): Promise<SearchFacesByImageCommandOutput | void> {
            try {
                const params = {
                    CollectionId,
                    Image: { Bytes: pessoasFotoBufer },
                    SimilarityThreshold: 85,
                };
    
                const command = new SearchFacesByImageCommand(params);
                const data = await this.rekogClient.send(command);
                return data;
            } catch (err) {
                console.log("Error", err);
            }
        }
    
        /**
         * Lista todos os rostos indexados em uma coleção do Amazon Rekognition.
         * @param CollectionId O ID da coleção da qual os rostos serão listados.
         * @returns Uma Promise que resolve com um objeto ListFacesCommandOutput contendo as informações dos rostos indexados.
         */
        public async listarFacesCollection(CollectionId: string): Promise<ListFacesCommandOutput | void> {
            try {
                const command = new ListFacesCommand({ CollectionId });
                const response = await this.rekogClient.send(command);
                return response;
            } catch (err: any) {
                console.log("Error", err.stack);
            }
        }
    
        /**
         * Adiciona um rosto à coleção especificada no Amazon Rekognition.
         * @param CollectionId O ID da coleção na qual o rosto será adicionado.
         * @param image O buffer da imagem contendo o rosto a ser adicionado.
         * @returns Uma Promise que resolve com um objeto IndexFacesCommandOutput se a adição for bem-sucedida, caso contrário, retorna void.
         */
        public async addFaceCollection(CollectionId: string, image: Buffer): Promise<IndexFacesCommandOutput | void> {
            try {
                const params = {
                    CollectionId,
                    Image: {
                        Bytes: image
                    }
                };
    
                const command = new IndexFacesCommand(params);
                const response = await this.rekogClient.send(command);
                return response;
            } catch (err) {
                console.log("Error", err);
            }
        }
    
       /**
     * Cria um novo usuário com um ID especificado em uma coleção do Amazon Rekognition.
     * @param CollectionId O ID da coleção na qual o usuário será criado.
     * @param UserId O ID do usuário a ser criado.
     * @returns Uma Promise que resolve com um objeto CreateUserCommandOutput se a criação for bem-sucedida, caso contrário, retorna void.
     * O usuarid tem que receber uma letra e um numero pra funcionar (ralei pra descobrir isso)
     */
       public async criaUsuario(CollectionId: string, UserId: string): Promise<CreateUserCommandOutput | void> {
        try {
            const params = {
                CollectionId,
                UserId,
                ClientRequestToken: 'dev' + new Date().getTime().toString()
            };

            const command = new CreateUserCommand(params);
            const response = await this.rekogClient.send(command);
            return response;
        } catch (err) {
            console.log("Error", err);
        }
    }

    /**
     * Exclui uma coleção do Amazon Rekognition com o ID especificado.
     * @param CollectionId O ID da coleção a ser excluída.
     * @returns Uma Promise que resolve com um objeto DeleteCollectionCommandOutput se a exclusão for bem-sucedida, caso contrário, retorna void.
     */
    public async deletaCollection(CollectionId: string): Promise<DeleteCollectionCommandOutput | void> {
        try {
            const command = new DeleteCollectionCommand({ CollectionId });
            const response = await this.rekogClient.send(command);
            return response;
        } catch (err) {
            console.log("Error", err);
        }
    }

    /**
     * Remove rostos específicos de uma coleção do Amazon Rekognition.
     * @param CollectionId O ID da coleção da qual os rostos serão removidos.
     * @param FaceIds Os IDs dos rostos a serem removidos.
     * @returns Uma Promise que resolve com um objeto DeleteFacesCommandOutput se a remoção for bem-sucedida, caso contrário, retorna void.
     */
    public async deletaFacesDoCollection(CollectionId: string, FaceIds: string[]): Promise<DeleteFacesCommandOutput | void> {
        try {
            const params = {
                CollectionId,
                FaceIds
            };

            const command = new DeleteFacesCommand(params);
            const response = await this.rekogClient.send(command);
            return response;
        } catch (err) {
            console.log("Error", err);
        }
    }

    /**
     * Exclui um usuário específico de uma coleção do Amazon Rekognition.
     * @param CollectionId O ID da coleção da qual o usuário será excluído.
     * @param UserId O ID do usuário a ser excluído.
     * @returns Uma Promise que resolve com um objeto DeleteUserCommandOutput se a exclusão for bem-sucedida, caso contrário, retorna void.
     */
    public async deletaUser(CollectionId: string, UserId: string): Promise<DeleteUserCommandOutput | void> {
        try {
            const params = {
                CollectionId,
                UserId
            };
            const command = new DeleteUserCommand(params);
            const response = await this.rekogClient.send(command);
            return response;
        } catch (err) {
            console.log("Error", err);
        }
    }

    /**
     * Associa rostos existentes a um usuário específico em uma coleção do Amazon Rekognition.
     * @param CollectionId O ID da coleção à qual os rostos pertencem.
     * @param FaceId O ID do rosto a ser associado ao usuário.
     * @param UserId O ID do usuário ao qual o rosto será associado.
     * @returns Uma Promise que resolve com um objeto AssociateFacesCommandOutput se a associação for bem-sucedida, caso contrário, retorna void.
     */
    public async associaFaces(CollectionId: string, FaceId: string, UserId: string): Promise<AssociateFacesCommandOutput | void> {
        try {
            const params = {
                CollectionId,
                FaceIds: [FaceId],
                UserId
            };

            const command = new AssociateFacesCommand(params);
            const response = await this.rekogClient.send(command);
            return response;
        } catch (err) {
            console.log("Error", err);
        }
    }
}


