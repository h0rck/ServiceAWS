import { AssociateFacesCommand, AssociateFacesCommandOutput, CompareFacesCommand, CompareFacesCommandOutput, CreateCollectionCommand, CreateCollectionCommandOutput, CreateUserCommand, CreateUserCommandOutput, DeleteCollectionCommand, DeleteCollectionCommandOutput, DeleteFacesCommand, DeleteFacesCommandOutput, DeleteUserCommand, DeleteUserCommandOutput, DetectFacesCommand, DetectFacesCommandOutput, IndexFacesCommand, IndexFacesCommandOutput, ListCollectionsCommand, ListCollectionsCommandOutput, ListFacesCommand, ListFacesCommandOutput, RekognitionClient, SearchFacesByImageCommand, SearchFacesByImageCommandOutput } from "@aws-sdk/client-rekognition";
import { fromIni } from "@aws-sdk/credential-providers";

export class ServicosAWS {

    private REGION = ""
    private profileName = "";
    private bucketName = "";
    private rekogClient: RekognitionClient;


    constructor() {

        this.rekogClient = new RekognitionClient(
            {
                region: this.REGION,
                credentials: fromIni({ profile: this.profileName }),
            }
        );
    }

    public async ComparaComImagemNoBucket(imagemLocal: Buffer, caminhoDaImagem: string ): Promise<CompareFacesCommandOutput | void> {
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
        
        try {
            const command  = new CompareFacesCommand(params);
            const response = await this.rekogClient.send(command);
            return response;
        }
        catch (error) {
            console.error('erro');
        }
    }


    async existePossoaNaImagem(imagem: Buffer): Promise<DetectFacesCommandOutput> {
        const params = {
            Image: {
                Bytes: imagem
            }
        };
        const command = new DetectFacesCommand(params);
        const response = await this.rekogClient.send(command);

        return response;
    }

    public async createCollection( collectionName: string): Promise<CreateCollectionCommandOutput | void>{
        try {
            const params = {
                CollectionId: collectionName,
            };

           const command = new CreateCollectionCommand(params);
           const data = await this.rekogClient.send(command)
           return data;
        } catch (err) {
          console.log("Error", err);
        }
      };

    public async listaCollections(): Promise<ListCollectionsCommandOutput> {

        const command = new ListCollectionsCommand({});
        const response = await this.rekogClient.send(command)
        return response;
    }

    async compararComCollection(CollectionId: string, pessoasFotoBufer : Buffer): Promise<SearchFacesByImageCommandOutput | void>{
    try {
        const params = {
            CollectionId,
            Image: { Bytes:  pessoasFotoBufer},
            SimilarityThreshold: 85,
        };

        const command = new SearchFacesByImageCommand(params);
        const data = await this.rekogClient.send(command)
        return data;
        
    } catch (err) {
        console.log("Error", err);
    }
    }

    public async listarFacesCollection(CollectionId: string): Promise<ListFacesCommandOutput | void> {
        try {
            // list_faces
            const command = new ListFacesCommand({CollectionId})

            const response = await this.rekogClient.send(command)
            return response;
         } catch (err:any) {
           console.log("Error", err.stack);
         }
    }
    
    public async addFaceToCollection(CollectionId: string, image: Buffer): Promise<IndexFacesCommandOutput | void> {
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

    public async criarUsuario(CollectionId: string, UserId:string): Promise<CreateUserCommandOutput | void> {
        // o usuarid tem que receber uma letra e um numero pra funcionar (ralei pra descobrir isso)
        try {
            const params = {
                CollectionId,
                UserId,
                ClientRequestToken: 'dev' + new Date().getTime().toString()
            };

            console.log('params', params);

            const command = new CreateUserCommand(params);
            const response = await this.rekogClient.send(command);
            
            return response;

        } catch (err) {
            console.log("Error", err);
        }
    }

    public async deleteCollection(CollectionId: string): Promise<DeleteCollectionCommandOutput | void> {
        try {
           const command = new DeleteCollectionCommand({CollectionId})
           const response = await this.rekogClient.send(command)
          
           return response; 
        } catch (err) {
          console.log("Error", err);
        }
      };


    public async deleteFacesFromCollection(CollectionId: string, FaceIds: string[]): Promise<DeleteFacesCommandOutput | void> {
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

    public async deleteUser(CollectionId: string, UserId: string): Promise<DeleteUserCommandOutput | void> {
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


    public async associateFaces(CollectionId: string, FaceId: string, UserId: string): Promise<AssociateFacesCommandOutput | void> {
        try {
            const params = {
                CollectionId,
                FaceIds : [FaceId],
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