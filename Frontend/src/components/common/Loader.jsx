import { Grid, Skeleton, Card, CardContent } from "@mui/material";

const Loader = () => {
  return (
    <>
      <Grid container spacing={3} mb={4}>
        {[1, 2, 3, 4].map((item) => (
          <Grid
            key={item}
            size={{
              xs: 12,
              md: 6,
              lg: 3,
            }}
          >
            <Card>
              <CardContent>
                <Skeleton height={30} width="40%" />

                <Skeleton height={60} width="70%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Skeleton variant="rounded" height={600} />
    </>
  );
};

export default Loader;
